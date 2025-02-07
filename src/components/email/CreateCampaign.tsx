"use client";
import { KeyboardEvent, useRef, useState } from "react";
import EmailForm from "./EmailForm";

const CreateCampaign = () => {
  const [campaignName, setCampaignName] = useState<string>("Untitled");
  const [editNameClicked, setEditNameClicked] = useState<boolean>(false);
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
    setEditNameClicked(true);
  };

  return (
    <div className="">
      <div className="border-b h-14">
        <div className="mx-auto w-4/5 flex justify-end">
          <button className="bg-black text-white px-6 py-2 rounded-3xl w-[10%]">
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
          {!editNameClicked ? (
            <button onClick={handleRenameClick} className="font-bold text-xs">
              Edit name
            </button>
          ) : (
            <div className="flex space-x-2 w-[15%]">
              <button
                // onClick={handleRenameClick}
                className="font-bold text-xs bg-black text-white px-6 py-2 w-full rounded-3xl"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditNameClicked(false);
                  inputRef.current?.blur()}}
                className="font-bold text-xs text-black border border-black px-6 w-full py-2 rounded-3xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <EmailForm />
    </div>
  );
};

export default CreateCampaign;
