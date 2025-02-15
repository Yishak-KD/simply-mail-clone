"use client";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import EditableField from "./EditableField";
import { isSuccessfullStatus } from "@/util/ResponseValidation";

const EmailEditor = () => {
  const [to, setTo] = useState<string>("");
  const [from, setFrom] = useState("contact@kedusbible.com");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [editHtml, setEditHtml] = useState(false);

  const [editTo, setEditTo] = useState(false);
  const [editFrom, setEditFrom] = useState(false);
  const [editSubject, setEditSubject] = useState(false);
  const [editBodyText, setEditBodyText] = useState<boolean>(false);

  const [campaignName, setCampaignName] = useState<string>();
  const [editNameClicked, setEditNameClicked] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const param = useParams();

  const fetchEmailCampaignTitle = async () => {
    const res = await axios.get(`/api/emailCampaign/${param.id as string}`);
    
    if(isSuccessfullStatus(res)) {
      setCampaignName(res.data.value.title as string)
    }

    console.log("-----------------Res for name title----------------------");
    console.log(campaignName);
    console.log("-----------------Res for name title----------------------");
  };

  const handleCampaignNameChange = (event: string) => {
    setCampaignName(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      inputRef.current?.blur();
    }
  };

  const handleRenameClick = () => {
    inputRef?.current?.focus();
    setEditNameClicked(true);
  };

  const handleSendEmail = async () => {
    setIsEmailLoading(true);
    try {
      const emailList = to.split(", ");

      await axios.post("/api/email", {
        subject: subject,
        bodyText: "string",
        to: emailList,
        html: htmlContent,
        from: from,
        newTitle: campaignName,
        emailCampaignId: param.id,
      });

      setSnackbarMessage("Email sent successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        router.push("/campaigns");
      }, 1000);
    } catch (error) {
      setSnackbarMessage("Error sending email");
      setSnackbarSeverity("error");
      console.warn(error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    fetchEmailCampaignTitle().catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-4/5 mx-auto bg-white rounded-lg relative">
      <button
        className="absolute top-4 right-4 bg-black text-white px-6 py-2 rounded-3xl w-[10%]"
        onClick={handleSendEmail}
      >
        <div className="flex items-center justify-center mx-auto outline-none">
          {isEmailLoading ? (
            <CircularProgress
              size={21}
              style={{
                color: "white",
              }}
            />
          ) : (
            "Send"
          )}
        </div>
      </button>
      <div className="space-y-2 mt-8 w-full mx-auto">
        <div className="flex flex-col items-start space-y-2">
          <input
            ref={inputRef}
            value={campaignName}
            onChange={(e) => handleCampaignNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="font-light text-3xl"
          />
          {!editNameClicked ? (
            <button onClick={handleRenameClick} className="font-bold text-xs">
              Edit name
            </button>
          ) : (
            <div className="flex space-x-2 w-[15%]">
              <button
                onClick={() => {
                  setEditNameClicked(false);
                }}
                className="font-bold text-xs bg-black text-white px-6 py-2 w-full rounded-3xl"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditNameClicked(false);
                  inputRef.current?.blur();
                }}
                className="font-bold text-xs text-black border border-black px-6 w-full py-2 rounded-3xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-12 border rounded-lg">
        <EditableField
          label="To"
          placeholder="Who are you sending this email to?"
          value={to}
          onEdit={() => setEditTo(!editTo)}
          editing={editTo}
          onChange={setTo}
        />
        <EditableField
          label="From"
          placeholder="Enter sender email"
          value={from}
          onEdit={() => setEditFrom(!editFrom)}
          editing={editFrom}
          onChange={setFrom}
        />
        <EditableField
          label="Subject"
          placeholder="What's the subject line for this email?"
          value={subject}
          onEdit={() => setEditSubject(!editSubject)}
          editing={editSubject}
          onChange={setSubject}
        />
        <EditableField
          label="Body Text"
          placeholder="Enter the body text for your email"
          value={bodyText}
          onEdit={() => setEditBodyText(!editBodyText)}
          editing={editBodyText}
          onChange={setBodyText}
        />
        <EditableField
          label="HTML Template"
          placeholder="Upload an HTML template for your email"
          value={htmlContent}
          onEdit={() => setEditHtml(!editHtml)}
          editing={editHtml}
          onChange={setHtmlContent}
          isFileUpload={true}
        />
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        style={{
          textAlign: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "fit",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmailEditor;
