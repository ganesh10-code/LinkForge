import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import {
  FaExternalLinkAlt,
  FaRegCalendarAlt,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { LiaCheckSolid } from "react-icons/lia";
import { MdAnalytics, MdOutlineAdsClick } from "react-icons/md";
import api from "../../apis/api";
import { Link, useNavigate } from "react-router-dom";
import { useStoreContext } from "../../contextApi/ContextApi";
import { Hourglass } from "react-loader-spinner";
import Graph from "./Graph";
import { BsQrCode } from "react-icons/bs";
import QrCodeModal from "./QrCodeModal";

const ShortenItem = ({
  originalUrl,
  shortUrl,
  clickCount,
  createdDate,
  expiresAt,
  onDelete,
  refetch,
}) => {
  const { token } = useStoreContext();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [analyticToggle, setAnalyticToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // --- Editable URL State ---
  const [editing, setEditing] = useState(false);
  const [newOriginalUrl, setNewOriginalUrl] = useState(originalUrl);
  const [updating, setUpdating] = useState(false);

  const subDomain = window.location.origin.replace(
    /^https?:\/\//,
    ""
  );

  const analyticsHandler = (shortUrl) => {
    if (!analyticToggle) {
      setSelectedUrl(shortUrl);
    }
    setAnalyticToggle(!analyticToggle);
  };

  const fetchMyShortUrl = async () => {
    setLoader(true);
    try {
      const endDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
      const startDate = dayjs().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ss");
      
      const { data } = await api.get(
        `/api/urls/analytics/${selectedUrl}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setAnalyticsData(data);
      setSelectedUrl("");
    } catch (error) {
      navigate("/error");
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (selectedUrl) {
      fetchMyShortUrl();
    }
  }, [selectedUrl]);

  // --- Update Original URL Handler ---
  const updateOriginalUrl = async () => {
    if (!newOriginalUrl || newOriginalUrl === originalUrl) {
      setEditing(false);
      return;
    }
    try {
      setUpdating(true);
      await api.put(
        `/api/urls/${shortUrl}`,
        { originalUrl: newOriginalUrl },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("URL updated successfully!");
      setEditing(false);
      if (refetch) refetch(); // refresh parent list
    } catch (error) {
      console.error(error);
      toast.error("Failed to update URL");
    } finally {
      setUpdating(false);
    }
  };

  // DELETE Handler
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this short URL?"))
      return;

    try {
      await api.delete(`/api/urls/${shortUrl}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success("Short URL deleted successfully!");
      if (onDelete) onDelete(shortUrl); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the short URL");
    }
  };

  const isExpired = expiresAt && dayjs().isAfter(dayjs(expiresAt));

  return (
    <div className="bg-white border-b border-borderColor last:border-0 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col lg:flex-row justify-between w-full p-6 gap-6">
        
        {/* URL Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-accent hover:text-indigo-700 transition-colors truncate"
              to={`${window.location.origin}/s/${shortUrl}`}
            >
              {subDomain + "/s/" + shortUrl}
            </Link>
            <FaExternalLinkAlt className="text-textSecondary text-xs" />
          </div>

          {/* Editable Original URL */}
          <div className="flex items-center gap-2 max-w-full">
            {editing ? (
              <input
                type="text"
                value={newOriginalUrl}
                onChange={(e) => setNewOriginalUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateOriginalUrl()}
                onBlur={updateOriginalUrl}
                disabled={updating}
                autoFocus
                className="flex-1 min-w-0 border border-borderColor rounded-md px-3 py-1.5 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            ) : (
              <div className="flex items-center gap-2 min-w-0 text-textSecondary text-sm group">
                <span className="truncate max-w-[300px] sm:max-w-md" title={newOriginalUrl}>
                  {newOriginalUrl}
                </span>
                <button 
                  onClick={() => setEditing(true)}
                  className="p-1 text-slate-400 hover:text-accent opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-slate-100"
                  title="Edit original URL"
                >
                  <FaEdit />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-1 text-sm text-textSecondary">
            <div className="flex items-center gap-1.5 font-medium text-textMain bg-slate-100 px-2 py-1 rounded-md">
              <MdOutlineAdsClick className="text-lg text-accent" />
              <span>{clickCount}</span>
              <span className="font-normal text-textSecondary">
                {clickCount === 1 ? "click" : "clicks"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <FaRegCalendarAlt className="text-slate-400" />
              <span>{dayjs(createdDate).format("MMM D, YYYY")}</span>
            </div>

            <div className={`flex items-center gap-1.5 ${isExpired ? 'text-error font-medium' : ''}`}>
              <span>
                {expiresAt
                  ? (isExpired ? "Expired" : `Expires ${dayjs(expiresAt).format("MMM D, YYYY")}`)
                  : "No expiration"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-start lg:justify-end gap-2 shrink-0">
          <CopyToClipboard
            onCopy={() => {
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            text={`${window.location.origin}/s/${shortUrl}`}
          >
            <button className="flex items-center gap-2 bg-white border border-borderColor hover:bg-slate-50 hover:border-slate-300 text-textMain px-3 py-2 rounded-lg font-medium transition-all text-sm shadow-sm">
              {isCopied ? <LiaCheckSolid className="text-success text-lg" /> : <IoCopy className="text-textSecondary text-lg" />}
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </CopyToClipboard>

          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-borderColor hover:bg-slate-50 hover:border-slate-300 text-textMain px-3 py-2 rounded-lg font-medium transition-all text-sm shadow-sm"
          >
            <BsQrCode className="text-textSecondary text-lg" />
            QR Code
          </button>

          <button
            onClick={() => analyticsHandler(shortUrl)}
            className={`flex items-center gap-2 border px-3 py-2 rounded-lg font-medium transition-all text-sm shadow-sm ${
              analyticToggle 
                ? 'bg-slate-100 border-slate-300 text-textMain' 
                : 'bg-white border-borderColor hover:bg-slate-50 hover:border-slate-300 text-textMain'
            }`}
          >
            <MdAnalytics className="text-textSecondary text-lg" />
            Analytics
          </button>

          <button
            onClick={deleteHandler}
            className="flex items-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-error px-3 py-2 rounded-lg font-medium transition-all text-sm shadow-sm"
          >
            <FaTrashAlt className="text-sm" />
          </button>
        </div>
      </div>
      
      {/* Analytics Dropdown */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 ${
          analyticToggle ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="p-6 bg-slate-50 h-[400px] relative">
          {loader ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <Hourglass
                visible={true}
                height="40"
                width="40"
                colors={["#4F46E5", "#818cf8"]}
              />
              <p className="text-textSecondary mt-3 text-sm font-medium">Loading analytics...</p>
            </div>
          ) : (
            <>
              {analyticsData.length === 0 ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                  <MdAnalytics className="text-slate-300 text-4xl mb-3" />
                  <h4 className="text-textMain font-medium mb-1">No clicks recorded yet</h4>
                  <p className="text-textSecondary text-sm max-w-sm">
                    Share your short link to start tracking engagement metrics.
                  </p>
                </div>
              ) : (
                <Graph graphData={analyticsData} />
              )}
            </>
          )}
        </div>
      </div>

      <QrCodeModal 
        open={qrModalOpen} 
        setOpen={setQrModalOpen} 
        url={`${window.location.origin}/s/${shortUrl}`} 
        shortUrl={shortUrl} 
      />
    </div>
  );
};

export default ShortenItem;
