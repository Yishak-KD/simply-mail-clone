const FormSection = ({
  title,
  description,
  buttonText,
  className,
  onClick
}: {
  title: string;
  description: string;
  buttonText: string;
  className?: string
  onClick?: VoidFunction
}) => (
  <div className={`flex justify-between items-center my-8 px-8 pb-8 ${className}`}>
    <div className="flex flex-col">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <div className="w-[15%]">
      <button className="w-full border-black border text-black font-semibold px-6 py-2 rounded-3xl">
        {buttonText}
      </button>
    </div>
  </div>
);

export default FormSection;
