import React, { useState } from "react";
import { useStoreContext } from "../../contextApi/ContextApi";
import { useForm } from "react-hook-form";
import TextField from "../TextField";
import { Tooltip } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import api from "../../apis/api";
import toast from "react-hot-toast";

const CreateNewShorten = ({ setOpen, refetch }) => {
  const { token } = useStoreContext();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: "",
      customAlias: "",
      expiresAt: "",
    },
    mode: "onTouched",
  });

  const createShortUrlHandler = async (data) => {
    setLoading(true);
    try {
      // Convert local datetime to UTC ISO string if provided
      let payload = { ...data };
      if (payload.expiresAt) {
        payload.expiresAt = new Date(payload.expiresAt).toISOString();
      }

      const { data: res } = await api.post("/api/urls/shorten", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const shortenUrl = `${
        `${window.location.origin}/s/${res.shortUrl}`
      }`;
      navigator.clipboard.writeText(shortenUrl).then(() => {
        toast.success("Short URL created and copied to clipboard!", {
          position: "bottom-center",
          duration: 3000,
        });
      });

      // REFRESH LIST
      if (refetch) await refetch();
      reset();
      setOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to create short link.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-transparent rounded-lg">
      <form
        onSubmit={handleSubmit(createShortUrlHandler)}
        className="w-[90vw] sm:w-[480px] relative bg-white border border-borderColor shadow-xl p-8 rounded-2xl"
      >
        <div className="mb-6">
          <h1 className="font-bold text-2xl text-textMain">
            Create new link
          </h1>
          <p className="text-sm text-textSecondary mt-1">
            Turn your long URL into a short, manageable link.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <TextField
              label="Destination URL"
              required
              id="originalUrl"
              placeholder="https://example.com/very/long/url"
              type="url"
              message="URL is required"
              register={register}
              errors={errors}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <TextField
              label="Custom Alias (optional)"
              id="customAlias"
              placeholder="e.g. my-campaign"
              type="text"
              register={register}
              errors={errors}
            />

            <TextField
              label="Expiration Date (optional)"
              id="expiresAt"
              type="datetime-local"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            className="px-5 py-2.5 bg-white border border-borderColor text-textMain font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? "Creating..." : "Create Link"}
          </button>
        </div>

        {!loading && (
          <Tooltip title="Close">
            <button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full text-textSecondary hover:bg-slate-100 hover:text-textMain transition-colors"
            >
              <RxCross2 className="text-xl" />
            </button>
          </Tooltip>
        )}
      </form>
    </div>
  );
};

export default CreateNewShorten;
