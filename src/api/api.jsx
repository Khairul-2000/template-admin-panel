import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API = axios.create({
  baseURL: "http://103.186.20.115:10002/api",
  // baseURL: "http://103.186.20.115:9001/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin dashboard
export const useAdminDashboard = () => {
  const getData = async () => {
    const response = await API.get("/admin/dashboard/");
    return response.data;
  };

  const {
    data: adminDashboard = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getData,
  });

  return { adminDashboard, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// users list
export const getMockUsers = async ({ page = 1, limit = 10 }) => {
  const res = await axios.get("/users_100.json");
  const allUsers = res.data || [];

  // Fake filtering (if status or role is provided)
  let filteredUsers = allUsers;

  // Fake pagination
  const totalUser = filteredUsers.length;
  const totalPages = Math.ceil(totalUser / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  return {
    data: paginatedUsers,
    pagination: {
      totalUser,
      page,
      limit,
      totalPages,
    },
  };
};

// get all users
export const useUsers = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(`/admin/users/?page=${page}&limit=${limit}`);

    return response.data;
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: getData,
  });

  return { users, isLoading, isError, error, refetch };
};

// get all payments
export const useStripePayments = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/admin/stripe-payments/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: stripePayments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["stripePayments", page, limit],
    queryFn: getData,
  });

  return { stripePayments, isLoading, isError, error, refetch };
};

// get all admin
export const useAllAdmins = () => {
  const getData = async () => {
    const response = await API.get("/admin/administrators/");
    return response.data;
  };

  const {
    data: allAdmins = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allAdmins"],
    queryFn: getData,
  });

  return { allAdmins, isLoading, isError, error, refetch };
};

// get all orbit post
export const useAllOrbitPost = () => {
  const getData = async () => {
    const response = await axios.get("/orbitPost.json");
    return response.data;
  };

  const {
    data: allOrbit = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allOrbit"],
    queryFn: getData,
  });

  return { allOrbit, isLoading, isError, error, refetch };
};

// administrators
export const getMockAdministrators = async () => {
  const response = await axios.get("/administrators_8.json");

  return response.data;
};

// payments
export const getMockPayments = async ({ page = 1, limit = 10 }) => {
  const res = await axios.get("/payments.json");
  const allData = res.data || [];

  // Fake pagination
  const totalPayments = allData.length;
  const totalPages = Math.ceil(totalPayments / limit);
  const paginatedPayments = allData.slice((page - 1) * limit, page * limit);

  return {
    data: paginatedPayments,
    pagination: {
      totalPayments,
      page,
      limit,
      totalPages,
    },
  };
};

// get message
export const getMockMessages = async () => {
  const response = await axios.get("/user_chat.json");

  return response.data;
};

// get previous scans
export const getMockPreviousScans = async () => {
  const response = await axios.get("/previousScans.json");

  return response.data;
};

// get Single scans
export const getMockSingleScans = async () => {
  const response = await axios.get("/singleScan.json");

  return response.data;
};

// get Saved Recipes
export const getMockSavedRecipes = async () => {
  const response = await axios.get("/recipes.json");

  return response.data;
};

// users list for messages
export const getMockUsersForMessages = async () => {
  const response = await axios.get("/messageUserList.json");

  return response.data;
};

export const useUsersForMessage = () => {
  const {
    data: usersForMessage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usersForMessage"],
    queryFn: getMockUsersForMessages,
  });

  return { usersForMessage, isLoading, isError, error, refetch };
};

// community
export const getMockCommunity = async () => {
  const response = await axios.get("/user_messages.json");

  return response.data;
};

export const useCommunityMessages = () => {
  const {
    data: communityMessage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["communityMessage"],
    queryFn: getMockCommunity,
  });

  return { communityMessage, isLoading, isError, error, refetch };
};



// get all food-orders
export const useAllMockFoodOrders = ({ page = 1, limit = 10 }) => {
  const getData = async ({ page = 1, limit = 10 }) => {
    const res = await axios.get("/foodOrder.json");
    const allData = res.data || [];

    // Fake pagination
    const totalPayments = allData.length;
    const totalPages = Math.ceil(totalPayments / limit);
    const paginatedPayments = allData.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedPayments,
      pagination: {
        totalPayments,
        page,
        limit,
        totalPages,
      },
    };
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allMockFoodOrders", page, limit],
    queryFn: getData,
  });

  const { data: allMockFoodOrders = [], pagination = {} } = response;

  return { allMockFoodOrders, pagination, isLoading, isError, error, refetch };
};
