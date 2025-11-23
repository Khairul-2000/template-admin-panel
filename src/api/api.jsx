import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const BASE_URL = "http://10.10.7.76:14009";

export const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin dashboard
export const useDashboard = () => {
  const getData = async () => {
    const response = await API.get("/api/shop/dashboard/");
    return response.data;
  };

  const {
    data: dashboardData = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: getData,
  });

  return { dashboardData, isLoading, isError, error, refetch };
};

// get low stock
export const useLowStock = () => {
  const getData = async () => {
    const response = await API.get("/api/shop/low-stock-products/");
    return response.data?.data;
  };

  const {
    data: lowStock = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lowStock"],
    queryFn: getData,
  });

  return { lowStock, isLoading, isError, error, refetch };
};

// get Earnings
export const useEarnings = () => {
  const getData = async () => {
    const response = await API.get("/api/shop/total-earnings/");
    return response.data;
  };

  const {
    data: earnsData = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["earnsData"],
    queryFn: getData,
  });

  return { earnsData, isLoading, isError, error, refetch };
};

// get admin dashboard
export const useAdminDashboard = () => {
  const getData = async () => {
    const response = await API.get("/api/auth/user/");
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

// get all food-orders
export const useAllFoodOrders = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(`/api/shop/admin/orders/`, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  };

  const {
    data: allFoodOrders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allFoodOrders", page, limit],
    queryFn: getData,
  });

  return { allFoodOrders, isLoading, isError, error, refetch };
};

// get all Users
export const useAllUsers = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(`/api/auth/user/list/`, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  };

  const {
    data: allUserList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUserList", page, limit],
    queryFn: getData,
  });

  return { allUserList, isLoading, isError, error, refetch };
};

// get all Products
export const useAllProducts = ({ page = 1, limit = 10, search }) => {
  const getData = async () => {
    const response = await API.get(`/api/shop/admin/products/list/`, {
      params: {
        page,
        limit,
        search,
      },
    });

    return response.data;
  };

  const {
    data: allProducts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allProducts", page, limit, search],
    queryFn: getData,
  });

  return { allProducts, isLoading, isError, error, refetch };
};

// get auth credential
export const useAuthCredential = () => {
  const getData = async () => {
    const response = await API.get("/api/auth/cretiential/");
    return response.data;
  };

  const {
    data: authCredential = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authCredential"],
    queryFn: getData,
  });

  return { authCredential, isLoading, isError, error, refetch };
};

// get Site Status
export const useSiteStatus = () => {
  const getData = async () => {
    const response = await API.get("/api/auth/site/status/");
    return response.data;
  };

  const {
    data: siteStatusData = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["siteStatusData"],
    queryFn: getData,
  });

  return { siteStatusData, isLoading, isError, error, refetch };
};
