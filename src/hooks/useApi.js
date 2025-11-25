"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const useApi = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const request = async ({
    url,
    method = "GET",
    body = null,
    headers = {},
    showSuccess = false,
    redirect = null,
    refresh = false,
    holdLoading = false,
  }) => {
    try {
      if (!holdLoading) setLoading(true);

      const options = { method, headers: { ...headers } };

      //  HANDLE FORMDATA UPLOAD
      if (body instanceof FormData) {
        options.body = body;
        delete options.headers["Content-Type"];
      }
      
      //  HANDLE NORMAL JSON BODY
      else if (body && method !== "GET") {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }

      const res = await fetch(url, options);
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Server Error");
        return { ok: false, data };
      }

      if (showSuccess) toast.success(data.message);

      if (redirect) router.push(redirect);

      if (refresh) router.refresh();

      return { ok: true, data };
    } catch (err) {
      console.error(err);
      toast.error("Server Error");
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  return { request, loading };
};
