import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleCreateCampaign = () => {
    router.push("/create-campaign");
  };

  return (
    <div className="flex justify-between items-center h-20">
      <h1 className="text-3xl leading-[50px] font-bold">All campaigns</h1>
      <button
        onClick={handleCreateCampaign}
        className="bg-black text-white px-6 py-2 rounded-3xl"
      >
        Create
      </button>
    </div>
  );
};

export default Header;
