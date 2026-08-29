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

  const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL.replace(
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
      const { data } = await api.get(
        `/api/urls/analytics/${selectedUrl}?startDate=2024-12-01T00:00:00&endDate=2025-12-31T23:59:59`,
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
      console.log(data);
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
      if (onDelete) onDelete(shortUrl); // notify parent to remove from UI
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the short URL");
    }
  };

  const isExpired = expiresAt && dayjs().isAfter(dayjs(expiresAt));

  return (
    <div
      className={`bg-slate-100 shadow-lg border border-dotted  border-slate-500 px-6 sm:py-1 py-3 rounded-md  transition-all duration-100 `}
    >
      <div
        className={`flex sm:flex-row flex-col  sm:justify-between w-full sm:gap-0 gap-5 py-5 `}
      >
        {/* URL Info */}
        <div className="flex-1 sm:space-y-1 max-w-full overflow-x-auto overflow-y-hidden ">
          <div className="text-slate-900 pb-1 sm:pb-0   flex items-center gap-2 ">
            {/* <a href={`${import.meta.env.VITE_REACT_SUBDOMAIN}/${shortUrl}`}
                target="_blank"
                className=" text-[17px]  font-montserrat font-[600] text-linkColor ">
                {subDomain + "/" + `${shortUrl}`}
            </a> */}

            <Link
              target="_"
              className="text-[17px]  font-montserrat font-[600] text-linkColor"
              to={
                import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`
              }
            >
              {subDomain + "/s/" + `${shortUrl}`}
            </Link>
            <FaExternalLinkAlt className="text-linkColor" />
          </div>

          {/* Editable Original URL */}
          <div className="flex items-center gap-2">
            {editing ? (
              <input
                type="text"
                value={newOriginalUrl}
                onChange={(e) => setNewOriginalUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateOriginalUrl()}
                onBlur={updateOriginalUrl}
                disabled={updating}
                autoFocus
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              <>
                <h3 className="text-slate-700 font-[400] text-[17px]">
                  {newOriginalUrl}
                </h3>
                <FaEdit
                  className="text-gray-500 cursor-pointer hover:text-blue-500"
                  onClick={() => setEditing(true)}
                />
              </>
            )}
          </div>

          <div className="flex   items-center gap-8 pt-6 ">
            <div className="flex gap-1  items-center font-semibold  text-green-800">
              <span>
                <MdOutlineAdsClick className="text-[22px] me-1" />
              </span>
              <span className="text-[16px]">{clickCount}</span>
              <span className="text-[15px] ">
                {clickCount === 0 || clickCount === 1 ? "Click" : "Clicks"}
              </span>
            </div>

            <div className="flex items-center gap-2 font-semibold text-lg text-slate-800">
              <span>
                <FaRegCalendarAlt />
              </span>
              <span className="text-[17px]">
                {dayjs(createdDate).format("MMM DD, YYYY")}
              </span>
            </div>

            <div className={`flex items-center gap-2 font-semibold text-sm ${isExpired ? 'text-red-600' : 'text-slate-600'}`}>
              <span className="text-[15px]">
                {expiresAt
                  ? (isExpired ? "Expired" : `Expires: ${dayjs(expiresAt).format("MMM DD, YYYY h:mm A")}`)
                  : "Never expires"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex  flex-1 flex-wrap sm:justify-end items-center gap-4">
          {/* Copy Button */}
          <CopyToClipboard
            onCopy={() => setIsCopied(true)}
            text={`${
              import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`
            }`}
          >
            <div className="flex cursor-pointer gap-1 items-center bg-btnColor py-2  font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white ">
              <button className="">{isCopied ? "Copied" : "Copy"}</button>
              {isCopied ? (
                <LiaCheckSolid className="text-md" />
              ) : (
                <IoCopy className="text-md" />
              )}
            </div>
          </CopyToClipboard>

          {/* QR Button */}
          <div
            onClick={() => setQrModalOpen(true)}
            className="flex cursor-pointer gap-1 items-center bg-indigo-600 py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white hover:bg-indigo-700 transition-colors"
          >
            <button>QR</button>
            <BsQrCode className="text-md" />
          </div>

          {/* Analytics Button */}
          <div
            onClick={() => analyticsHandler(shortUrl)}
            className="flex cursor-pointer gap-1 items-center bg-green-700 py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white "
          >
            <button>Analytics</button>
            <MdAnalytics className="text-md" />
          </div>

          {/* Delete Button */}
          <div
            onClick={deleteHandler}
            className="flex cursor-pointer gap-1 items-center bg-red-600 py-2 font-semibold shadow-md shadow-slate-500 px-6 rounded-md text-white "
          >
            <button>Delete</button>
            <FaTrashAlt className="text-md" />
          </div>
        </div>
      </div>
      <React.Fragment>
        <div
          className={`${
            analyticToggle ? "flex" : "hidden"
          }  max-h-96 sm:mt-0 mt-5 min-h-96 relative  border-t-2 w-[100%] overflow-hidden `}
        >
          {loader ? (
            <div className="min-h-[calc(450px-140px)] flex justify-center items-center w-full">
              <div className="flex flex-col items-center gap-1">
                <Hourglass
                  visible={true}
                  height="50"
                  width="50"
                  ariaLabel="hourglass-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  colors={["#306cce", "#72a1ed"]}
                />
                <p className="text-slate-700">Please Wait...</p>
              </div>
            </div>
          ) : (
            <>
              {analyticsData.length === 0 && (
                <div className="absolute flex flex-col  justify-center sm:items-center items-end  w-full left-0 top-0 bottom-0 right-0 m-auto">
                  <h1 className=" text-slate-800 font-serif sm:text-2xl text-[15px] font-bold mb-1">
                    No Data For This Time Period
                  </h1>
                  <h3 className="sm:w-96 w-[90%] sm:ml-0 pl-6 text-center sm:text-lg text-[12px] text-slate-600 ">
                    Share your short link to view where your engagements are
                    coming from
                  </h3>
                </div>
              )}
              <Graph graphData={analyticsData} />
            </>
          )}
        </div>
      </React.Fragment>

      <QrCodeModal 
        open={qrModalOpen} 
        setOpen={setQrModalOpen} 
        url={`${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${shortUrl}`} 
        shortUrl={shortUrl} 
      />
    </div>
  );
};

export default ShortenItem;
