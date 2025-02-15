"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import CreateAudienceModal from "../modals/CreateAudienceModal";
import { isSuccessfullStatus } from "@/util/ResponseValidation";
import AudienceList from "./AudienceList";
import type { Audience } from "@prisma/client";
import { useRouter } from "next/navigation";

const Audience = () => {
  const [audienceName, setAudienceName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAudienceModal, setOpenAudienceModal] = useState<boolean>(false);
  const [audienceList, setAudienceList] = useState<Audience[]>([]);
  const router = useRouter();

  const handleAudienceNameChange = (name: string | null) => {
    setAudienceName(name);
  };

  const handleAudienceModal = () => {
    setOpenAudienceModal(true);
  };

  const fetchAudienceLists = async () => {
    try {
      const response = await axios.get("/api/audience", {});

      if (isSuccessfullStatus(response)) {
        setAudienceList(response.data.value as Audience[]);
      }
    } catch (error) {
      console.error("Error fetching audience lists:", error);
    }
  };

  const handleCreateAudience = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/audience", {
        audienceName,
      });

      if (isSuccessfullStatus(res)) {
        setOpenAudienceModal(false);
        await fetchAudienceLists();
        handleAudienceNameChange("");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAudienceClick = (id: string) => {
    router.push(`/audience/contacts/${id}`);
  };

  useEffect(() => {
    fetchAudienceLists().catch((error) => console.error(error));
  }, []);

  return (
    <div className="mt-20">
      <div className="border-b">
        <div className="flex w-4/5 mx-auto justify-between mb-2">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Manage audiences
          </h2>
          <button
            onClick={handleAudienceModal}
            className="bg-black text-white px-8 py-0 rounded-3xl h-10"
          >
            Create audience
          </button>
        </div>
      </div>
      <div>
        <AudienceList
          audienceList={audienceList}
          onAudienceClick={handleAudienceClick}
        />
      </div>
      <CreateAudienceModal
        showAudienceModal={openAudienceModal}
        onCloseAudienceModal={() => {
          setOpenAudienceModal(false);
          setAudienceName(null);
        }}
        onAudienceNameChange={handleAudienceNameChange}
        handleCreateAudience={handleCreateAudience}
        loading={loading}
      />
    </div>
  );
};

export default Audience;
