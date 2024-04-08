interface StudentIntroCardProps {
  name: string;
  message: string;
}

const StudentIntroCard = ({ name, message }: StudentIntroCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default StudentIntroCard;
