import axios from "axios";
import { useRouter } from "next/navigation";
import { isSuccessfullStatus } from "@/util/ResponseValidation";

const Header = () => {
  const router = useRouter();

  const handleCreateCampaign = async () => {
    try {
      const res = await axios.post("/api/emailCampaign/create");

      if (isSuccessfullStatus(res)) {
        const emailCampaignId = res.data.value.emailCampaignId;

        router.push(`/create-campaign/${emailCampaignId}`, );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between items-center h-20">
      <h1 className="text-3xl leading-[50px] font-bold">All campaigns</h1>
      <button
        onClick={handleCreateCampaign}
        className="bg-black text-white px-6 py-2 rounded-3xl h-10"
      >
        Create
      </button>
    </div>
  );
};

export default Header;
