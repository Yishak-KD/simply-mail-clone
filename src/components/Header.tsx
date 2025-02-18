import axios from "axios";
import { useRouter } from "next/navigation";
import { isSuccessfullStatus } from "@/utils/ResponseValidation";
import { useState } from "react";
import CTAButton from "./CTAButton";

const Header = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateCampaign = async () => {
    setLoading(false);
    try {
      const res = await axios.post("/api/emailCampaign");

      if (isSuccessfullStatus(res)) {
        const emailCampaignId = res.data.value.id;

        router.push(`/create-campaign/${emailCampaignId}`);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(true);
  };

  return (
    <div className="flex justify-between items-center h-20">
      <h1 className="text-3xl leading-[50px] font-bold">All campaigns</h1>
      <CTAButton
        title="Create"
        onClick={handleCreateCampaign}
        loading={loading}
        className="bg-black text-white px-8 py-2 rounded-full h-10"
      />
    </div>
  );
};

export default Header;
