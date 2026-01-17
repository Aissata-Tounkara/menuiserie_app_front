

const StatCard = ({ icon: Icon, value, label, iconColor = "bg-blue-500" }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className={`${iconColor} w-10 h-10 rounded-2xl flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-2">{value}</div>
      <div className="text-gray-500 text-lg">{label}</div>
    </div>
  );
};


export default StatCard;