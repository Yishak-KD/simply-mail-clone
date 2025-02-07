import FormSection from "./FormSection";

const EmailForm = () => {
  return (
    <div className="w-4/5 mx-auto mt-8 border rounded-md">
      <FormSection
        title="To"
        description="Who are you sending this email to?"
        buttonText="Add recipients"
        className="border-b"
      />
      <FormSection
        title="From"
        description="contact@kedusbible.com"
        buttonText="Edit from"
        className="border-b"
      />
      <FormSection
        title="Subject"
        description="What's the subject line for this email?"
        buttonText="Add subject"
      />
    </div>
  );
};

export default EmailForm;