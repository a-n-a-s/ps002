// Firebase hooks placeholder
// Install firebase: npm install firebase
// Then use these hooks for real-time data

export interface Donor {
  id: string;
  name: string;
  bloodType: string;
  email: string;
  phone: string;
  availability: boolean;
  reliabilityScore: number;
  livesSaved: number;
  streak: number;
  location?: { lat: number; lng: number };
}

export interface EmergencyRequest {
  id: string;
  bloodType: string;
  units: number;
  urgency: 'critical' | 'warning' | 'stable';
  hospitalId: string;
  survival: number;
  status: 'pending' | 'matched' | 'fulfilled';
}

export interface Inventory {
  bloodType: string;
  units: number;
  bankId: string;
}

// Demo data hooks (replace with Firebase hooks in production)
export function useDonors() {
  return {
    donors: [
      { id: '1', name: 'Ravi K.', bloodType: 'O-', email: 'ravi@example.com', phone: '1234567890', availability: true, reliabilityScore: 91, livesSaved: 23, streak: 12 },
      { id: '2', name: 'Sarah M.', bloodType: 'O-', email: 'sarah@example.com', phone: '1234567891', availability: true, reliabilityScore: 84, livesSaved: 15, streak: 8 },
    ] as Donor[],
    loading: false,
    error: null,
  };
}

export function useInventory() {
  return {
    inventory: [
      { bloodType: 'O-', units: 2, bankId: 'city' },
      { bloodType: 'O+', units: 18, bankId: 'city' },
      { bloodType: 'A+', units: 12, bankId: 'city' },
      { bloodType: 'A-', units: 4, bankId: 'city' },
      { bloodType: 'B+', units: 9, bankId: 'city' },
      { bloodType: 'B-', units: 2, bankId: 'city' },
      { bloodType: 'AB+', units: 6, bankId: 'city' },
      { bloodType: 'AB-', units: 14, bankId: 'city' },
    ] as Inventory[],
    loading: false,
  };
}

export function useEmergencyRequests() {
  return {
    requests: [
      { id: 'EMG-0041', bloodType: 'O-', units: 1, urgency: 'critical' as const, hospitalId: 'h1', survival: 42, status: 'pending' as const },
    ] as EmergencyRequest[],
    loading: false,
  };
}