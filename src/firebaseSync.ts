import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db, auth } from "./firebase";

// Enum and interface for strict Firestore error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Re-declare interfaces locally for strict typing in sync module
export interface Review {
  id: string;
  customerName: string;
  score: number;
  comment: string;
  isRealPromo: boolean;
  timestamp: string;
}

export interface Shop {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export interface Sale {
  id: string;
  shopId: string;
  shopName: string;
  city: string;
  discount: number;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface OwnerNotification {
  id: string;
  type: "INTERESTED" | "NOTIFY_ME";
  customerName: string;
  saleId: string;
  saleName: string;
  timestamp: string;
  read: boolean;
}

// Collections references
const shopsCol = collection(db, "shops");
const salesCol = collection(db, "sales");
const notificationsCol = collection(db, "notifications");

/**
 * Seed database with initial mock data if collections are empty.
 */
export async function seedDatabaseIfEmpty(initialShops: Shop[], initialSales: Sale[]) {
  try {
    const shopsSnapshot = await getDocs(shopsCol).catch(err => {
      handleFirestoreError(err, OperationType.GET, "shops");
    });
    if (shopsSnapshot && shopsSnapshot.empty) {
      console.log("Seeding initial shops to Firestore...");
      for (const shop of initialShops) {
        await setDoc(doc(db, "shops", shop.id), shop).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `shops/${shop.id}`);
        });
      }
    }

    const salesSnapshot = await getDocs(salesCol).catch(err => {
      handleFirestoreError(err, OperationType.GET, "sales");
    });
    if (salesSnapshot && salesSnapshot.empty) {
      console.log("Seeding initial sales to Firestore...");
      for (const sale of initialSales) {
        await setDoc(doc(db, "sales", sale.id), sale).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `sales/${sale.id}`);
        });
      }
    }
  } catch (err) {
    console.error("Error seeding Firestore database:", err);
  }
}

/**
 * Subscribe to shops in real-time.
 */
export function subscribeToShops(onUpdate: (shops: Shop[]) => void) {
  return onSnapshot(shopsCol, (snapshot) => {
    const shops: Shop[] = [];
    snapshot.forEach((doc) => {
      shops.push(doc.data() as Shop);
    });
    onUpdate(shops);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, "shops");
  });
}

/**
 * Subscribe to sales in real-time.
 */
export function subscribeToSales(onUpdate: (sales: Sale[]) => void) {
  return onSnapshot(salesCol, (snapshot) => {
    const sales: Sale[] = [];
    snapshot.forEach((doc) => {
      sales.push(doc.data() as Sale);
    });
    onUpdate(sales);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, "sales");
  });
}

/**
 * Subscribe to notifications in real-time.
 */
export function subscribeToNotifications(onUpdate: (notifications: OwnerNotification[]) => void) {
  const q = query(notificationsCol);
  return onSnapshot(q, (snapshot) => {
    const notifications: OwnerNotification[] = [];
    snapshot.forEach((doc) => {
      notifications.push(doc.data() as OwnerNotification);
    });
    notifications.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    onUpdate(notifications);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, "notifications");
  });
}

/**
 * Save or update a shop profile.
 */
export async function saveShop(shop: Shop) {
  try {
    await setDoc(doc(db, "shops", shop.id), shop);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `shops/${shop.id}`);
  }
}

/**
 * Save or update a sale event.
 */
export async function saveSale(sale: Sale) {
  try {
    await setDoc(doc(db, "sales", sale.id), sale);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `sales/${sale.id}`);
  }
}

/**
 * Delete a sale event.
 */
export async function deleteSale(saleId: string) {
  try {
    await deleteDoc(doc(db, "sales", saleId));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `sales/${saleId}`);
  }
}

/**
 * Save or update an owner alert / notification.
 */
export async function saveNotification(notification: OwnerNotification) {
  try {
    await setDoc(doc(db, "notifications", notification.id), notification);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `notifications/${notification.id}`);
  }
}

/**
 * Save a review inside a specific shop.
 */
export async function saveReview(shopId: string, review: Review, currentReviews: Review[]) {
  try {
    const updatedReviews = [review, ...currentReviews];
    const totalScore = updatedReviews.reduce((sum, r) => sum + r.score, 0);
    const updatedRating = parseFloat((totalScore / updatedReviews.length).toFixed(1));
    
    const shopRef = doc(db, "shops", shopId);
    await setDoc(shopRef, {
      reviews: updatedReviews,
      reviewsCount: updatedReviews.length,
      rating: updatedRating
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `shops/${shopId}`);
  }
}
