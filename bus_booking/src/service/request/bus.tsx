import createApiClient from '../apiClient';

// Fetch buses based on route and date
export const fetchBuses = async (from: string, to: string, date: string) => {
  try {
    const api = await createApiClient();
    const { data } = await api.post('/bus/search', { from, to, date });
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching buses:', error);
    return [];
  }
};

// Fetch detailed info for a specific bus
export const fetchBusDetails = async (busId: string) => {
  try {
    const api = await createApiClient();
    const { data } = await api.get(`/bus/${busId}`);
    return data?.data || {};
  } catch (error) {
    console.error('Error fetching bus details:', error);
    return {};
  }
};

// Book a ticket for selected seats (supports guests)
export const bookTicket = async ({
  busId,
  date,
  seatNumbers,
  guestName,
  guestEmail,
}: {
  busId: string;
  date: string;
  seatNumbers: number[];
  guestName?: string;
  guestEmail?: string;
}) => {
  try {
    console.log("📦 Preparing to book ticket with data:");
    console.log({ busId, date, seatNumbers, guestName, guestEmail });

    const api = await createApiClient();
    console.log("🔌 API client initialized");

    const payload = {
      busId,
      date,
      seatNumbers,
      guestName,
      guestEmail,
    };

    console.log("📤 Sending POST request to /ticket/book with payload:");
    console.log(payload);

    const { data } = await api.post('/ticket/book', payload);

    console.log("✅ Ticket booking successful. Response data:");
    console.log(data);

    return data?.ticket;
  } catch (error: any) {
    console.error("❌ Error booking ticket:", error.message);
    if (error.response) {
      console.error("📥 Backend error response:", error.response.data);
    } else {
      console.error("⚠️ Unexpected error:", error);
    }
    return null;
  }
};


// Fetch all tickets for the logged-in user
export const fetchUserTickets = async () => {
  try {
    const api = await createApiClient();
    const { data } = await api.get('/ticket/my-tickets');
    return data?.tickets || [];
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return [];
  }
};

// ✅ Fetch all tickets by guest email (GET with query param)
export const fetchGuestTickets = async (email: string) => {
  try {
    const api = await createApiClient();
    const { data } = await api.get(`/ticket/guest-tickets?email=${encodeURIComponent(email)}`);
    return data?.tickets || [];
  } catch (error) {
    console.error('Error fetching guest tickets:', error);
    return [];
  }
};
