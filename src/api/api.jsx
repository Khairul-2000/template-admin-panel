import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const BASE_URL = "https://api.orderwithpluto.com";

export const LOCAL_BASE_URL = "http://10.10.7.76:14009";

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



// get all Seller
export const useSellers = () => {
  const getData = async () => {
    const response = await API.get("/api/shop/sellers/");
    return response.data;
  };

  const {
    data: allSellers = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allSellers"],
    queryFn: getData,
  });

  return { allSellers, isLoading, isError, error, refetch };
};

// get single seller
export const useSingleSeller = (sellerId, options = {}) => {
  const getData = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    const response = await API.get(`/api/shop/sellers/${id}/`);
    return response.data;
  };

  const {
    data: sellerDetail = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleSeller", sellerId],
    queryFn: getData,
    enabled: !!sellerId && (options.enabled ?? true),
  });

  return { sellerDetail, isLoading, isError, error, refetch };
};

// create seller
export const createSeller = async (sellerData) => {
  const formData = new FormData();
  formData.append("title", sellerData.title);
  formData.append("description", sellerData.description);
  if (sellerData.image) {
    formData.append("image", sellerData.image);
  }

  const response = await API.post("/api/shop/sellers/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// // update seller
// export const updateSeller = async (sellerId, sellerData) => {
//   const formData = new FormData();
//   formData.append("title", sellerData.title);
//   formData.append("description", sellerData.description);
//   if (sellerData.image && typeof sellerData.image !== 'string') {
//     formData.append("image", sellerData.image);
//   }

//   const response = await API.put(`/api/shop/sellers/${sellerId}/`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// // delete seller
// export const deleteSeller = async (sellerId) => {
//   const response = await API.delete(`/api/shop/sellers/${sellerId}/`);
//   return response.data;
// };


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

// single order
export const useSingleOrder = ({ orderID }, options = {}) => {
  const getData = async ({ queryKey }) => {
    const [_key, orderID] = queryKey;
    const response = await API.get(`/api/shop/admin/orderdetails/${orderID}/`);
    return response.data;
  };

  const {
    data: singleOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleOrder", orderID],
    queryFn: getData,
    enabled: !!orderID && (options.enabled ?? true),
  });

  return { singleOrder, isLoading, isError, error, refetch };
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

    // console.log(response.data, "response data");

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

// update credentials (supports multiple fields)
export const updateCredentials = async (credentialData) => {
  const response = await API.patch("/api/auth/cretiential/update/", credentialData);
    // console.log(response.data, "response data");
  return response.data;
};

// get Site Status
export const useSiteStatus = () => {
  const getData = async () => {
    const response = await API.get("/api/auth/site/status/");

    // console.log("Site Status Response:", response.data);
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
