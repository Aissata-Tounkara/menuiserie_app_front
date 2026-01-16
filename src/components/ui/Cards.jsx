import React from 'react';
import { Users, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, iconColor = "bg-blue-500" }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className={`${iconColor} w-20 h-20 rounded-2xl flex items-center justify-center mb-4`}>
        <Icon className="w-10 h-10 text-white" strokeWidth={2} />
      </div>
      <div className="text-4xl font-bold text-gray-800 mb-2">{value}</div>
      <div className="text-gray-500 text-lg">{label}</div>
    </div>
  );
};

// Exemple d'utilisation avec différentes configurations
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users}
          value="8"
          label="Total Clients"
          iconColor="bg-blue-500"
        />
        
        <StatCard 
          icon={TrendingUp}
          value="24%"
          label="Croissance"
          iconColor="bg-green-500"
        />
        
        <StatCard 
          icon={DollarSign}
          value="12,450€"
          label="Revenus"
          iconColor="bg-purple-500"
        />
        
        <StatCard 
          icon={ShoppingCart}
          value="156"
          label="Commandes"
          iconColor="bg-orange-500"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Autres exemples de couleurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Users}
            value="42"
            label="Utilisateurs Actifs"
            iconColor="bg-pink-500"
          />
          
          <StatCard 
            icon={TrendingUp}
            value="89%"
            label="Satisfaction"
            iconColor="bg-teal-500"
          />
          
          <StatCard 
            icon={DollarSign}
            value="5,280€"
            label="Dépenses"
            iconColor="bg-red-500"
          />
          
          <StatCard 
            icon={ShoppingCart}
            value="73"
            label="Paniers Actifs"
            iconColor="bg-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default App;