"use client";
import { KeyboardEvent, useRef, useState } from "react";
import EmailForm from "./EmailForm";

const CreateCampaign = () => {
  const [campaignName, setCampaignName] = useState<string>("Untitled");
  const inputRef = useRef<HTMLInputElement | null>(null);

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
  };

  return (
    <div className="">
      <div className="border-b h-14">
        <div className="mx-auto w-4/5 flex justify-end">
          <button className="bg-black text-white px-6 py-2 rounded-3xl">
            Send
          </button>
        </div>
      </div>
      <div className="space-y-2 mt-8 w-4/5 mx-auto">
        <div className="flex flex-col items-start space-y-2">
          <input
            ref={inputRef}
            value={campaignName}
            onChange={(e) => handleCampaignNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="font-light text-3xl"
          />
          <button onClick={handleRenameClick} className="font-bold text-xs">
            Edit name
          </button>
        </div>
      </div>
      <EmailForm />
    </div>
  );
};

export default CreateCampaign;
