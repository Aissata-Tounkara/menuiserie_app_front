import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Grid, List, Package, DollarSign, Ruler, Palette, Upload, X } from 'lucide-react';
import { Link } from "react-router-dom";

export default function CatalogueProduits({ produits = [], setProduits = () => {} }) {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newColor, setNewColor] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [addFormData, setAddFormData] = useState({
    nom: '',
    reference: '',
    categorie: 'Fenêtres',
    description: '',
    prixBase: '',
    stock: '',
    imageUrl: null,
    imageFile: null,
    largeur: '',
    hauteur: '',
    couleurs: [],
    ventes: 0
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [addNewColor, setAddNewColor] = useState('');

  const categories = ['Tous', 'Fenêtres', 'Portes', 'Volets', 'Baies vitrées', 'Garde-corps'];

  const colorMap = {
    'Blanc': '#f5f5f5',
    'Gris': '#6b7280',
    'Beige': '#d4a574',
    'Noir': '#1f2937',
    'Marron': '#92400e',
    'Bleu': '#3b82f6',
    'Gris anthracite': '#374151',
    'Vert': '#059669'
  };

  // Fonctions pour la modale d'ajout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setAddFormData(prev => ({
          ...prev,
          imageFile: file,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setAddFormData(prev => ({
      ...prev,
      imageFile: null,
      imageUrl: null
    }));
  };

  const handleAddColor = () => {
    if (addNewColor.trim() && !addFormData.couleurs.includes(addNewColor)) {
      setAddFormData(prev => ({
        ...prev,
        couleurs: [...prev.couleurs, addNewColor]
      }));
      setAddNewColor('');
    }
  };

  const handleRemoveColorFromAdd = (index) => {
    setAddFormData(prev => ({
      ...prev,
      couleurs: prev.couleurs.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!addFormData.nom.trim()) return 'Le nom du produit est requis';
    if (!addFormData.reference.trim()) return 'La référence est requise';
    if (!addFormData.description.trim()) return 'La description est requise';
    if (!addFormData.prixBase || addFormData.prixBase <= 0) return 'Le prix doit être supérieur à 0';
    if (!addFormData.stock || addFormData.stock < 0) return 'Le stock doit être positif';
    if (!addFormData.largeur.trim()) return 'La largeur est requise';
    if (!addFormData.hauteur.trim()) return 'La hauteur est requise';
    if (addFormData.couleurs.length === 0) return 'Ajoutez au moins une couleur';
    if (!addFormData.imageUrl) return 'Veuillez télécharger une image';
    return null;
  };

  const handleAddProduct = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const newProduct = {
      id: produits && produits.length > 0 ? Math.max(...produits.map(p => p.id), 0) + 1 : 1,
      nom: addFormData.nom,
      reference: addFormData.reference,
      categorie: addFormData.categorie,
      description: addFormData.description,
      prixBase: parseInt(addFormData.prixBase),
      stock: parseInt(addFormData.stock),
      imageUrl: addFormData.imageUrl,
      couleurs: addFormData.couleurs,
      dimensions: {
        largeur: addFormData.largeur,
        hauteur: addFormData.hauteur
      },
      ventes: parseInt(addFormData.ventes) || 0
    };

    setProduits([...produits, newProduct]);

    setAddFormData({
      nom: '',
      reference: '',
      categorie: 'Fenêtres',
      description: '',
      prixBase: '',
      stock: '',
      imageUrl: null,
      imageFile: null,
      largeur: '',
      hauteur: '',
      couleurs: [],
      ventes: 0
    });
    setImagePreview(null);
    setAddNewColor('');
    setShowAddModal(false);

    alert('✅ Produit ajouté avec succès !');
  };

  const handleCloseAddModal = () => {
    if (window.confirm('Êtes-vous sûr ? Toutes les données seront perdues.')) {
      setShowAddModal(false);
      setAddFormData({
        nom: '',
        reference: '',
        categorie: 'Fenêtres',
        description: '',
        prixBase: '',
        stock: '',
        imageUrl: null,
        imageFile: null,
        largeur: '',
        hauteur: '',
        couleurs: [],
        ventes: 0
      });
      setImagePreview(null);
      setAddNewColor('');
    }
  };

  // Autres fonctions
  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setProduits(produits.map(p => p.id === editForm.id ? editForm : p));
    setSelectedProduct(editForm);
    setIsEditing(false);
  };

  const handleAddColorEdit = () => {
    if (newColor.trim() && !editForm.couleurs.includes(newColor)) {
      setEditForm(prev => ({
        ...prev,
        couleurs: [...prev.couleurs, newColor]
      }));
      setNewColor('');
    }
  };

  const handleRemoveColorEdit = (index) => {
    setEditForm(prev => ({
      ...prev,
      couleurs: prev.couleurs.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProduits(produits.filter(p => p.id !== id));
      setSelectedProduct(null);
    }
  };

  const filteredProducts = produits.filter(produit => {
    const matchCategory = selectedCategory === 'Tous' || produit.categorie === selectedCategory;
    const matchSearch = produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        produit.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getStockStatus = (stock) => {
    if (stock > 30) return { label: 'En stock', color: 'bg-green-100 text-green-800' };
    if (stock > 10) return { label: 'Stock limité', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Stock faible', color: 'bg-red-100 text-red-800' };
  };

  const openEditModal = (product) => {
    setEditForm(product);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">

           {/* Bouton visible seulement sur mobile (<640px) */}
              <button className="sm:hidden mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => setShowLinks(!showLinks)}
            > 
              {showLinks ? "Fermer le menu" : "Afficher le menu"}
            </button>
      
              <div
              className={`${
                showLinks ? "grid grid-cols-2 gap-2" : "hidden"
              } sm:flex sm:items-center sm:justify-between sm:gap-2`}
            >
              <Link
                to="/dashboard"
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/gestion-clients"
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                Gestion clients
              </Link>
              <Link
                to="/gestion-commandes"
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                Gestion des Commandes
              </Link>
              <Link
                to="/gestion-de-stock"
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                Gestion des stocks
              </Link>
              <Link
                to="/gestion-devis"
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                Gestion des devis
              </Link>
              <Link
                to="/gestion-de-facture"
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                Gestion des factures
              </Link>
              <Link
                to="/gestion-depenses"
                className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                Gestion des dépenses
              </Link>
            </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catalogue Produits</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} produits disponibles</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau produit
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou référence..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid view */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(produit => {
              const stockStatus = getStockStatus(produit.stock);
              return (
                <div
                  key={produit.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProduct(produit)}
                >
                  <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 h-48 flex items-center justify-center">
                    {produit.imageUrl ? (
                      <img src={produit.imageUrl} alt={produit.nom} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">{produit.image}</span>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">{produit.reference}</span>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{produit.nom}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{produit.description}</p>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Ruler className="w-4 h-4" />
                        {produit.dimensions.largeur} × {produit.dimensions.hauteur}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        Stock: {produit.stock} unités
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500">Prix</div>
                        <div className="text-xl font-bold text-blue-600">
                          {produit.prixBase.toLocaleString()} DA
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(produit);
                          }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(produit.id);
                          }}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* MODALE D'AJOUT DE PRODUIT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ajouter un Produit</h2>
                <button
                  onClick={handleCloseAddModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Upload image */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3">Image du produit *</label>
                  {imagePreview ? (
                    <div className="relative w-full max-w-xs">
                      <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg border-2 border-blue-300" />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="font-semibold text-gray-700">Cliquez pour télécharger</p>
                        <p className="text-sm text-gray-500">ou glissez-déposez une image</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Nom et Référence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Nom du produit *</label>
                    <input
                      type="text"
                      name="nom"
                      value={addFormData.nom}
                      onChange={handleInputChange}
                      placeholder="Ex: Fenêtre Coulissante"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Référence *</label>
                    <input
                      type="text"
                      name="reference"
                      value={addFormData.reference}
                      onChange={handleInputChange}
                      placeholder="Ex: FEN-C-001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Catégorie et Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Catégorie *</label>
                    <select
                      name="categorie"
                      value={addFormData.categorie}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Fenêtres">Fenêtres</option>
                      <option value="Portes">Portes</option>
                      <option value="Volets">Volets</option>
                      <option value="Baies vitrées">Baies vitrées</option>
                      <option value="Garde-corps">Garde-corps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Stock (unités) *</label>
                    <input
                      type="number"
                      name="stock"
                      value={addFormData.stock}
                      onChange={handleInputChange}
                      placeholder="Ex: 45"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Largeur *</label>
                    <input
                      type="text"
                      name="largeur"
                      value={addFormData.largeur}
                      onChange={handleInputChange}
                      placeholder="Ex: 1.20m"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Hauteur *</label>
                    <input
                      type="text"
                      name="hauteur"
                      value={addFormData.hauteur}
                      onChange={handleInputChange}
                      placeholder="Ex: 1.50m"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Prix et Ventes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Prix (DA) *</label>
                    <input
                      type="number"
                      name="prixBase"
                      value={addFormData.prixBase}
                      onChange={handleInputChange}
                      placeholder="Ex: 15000"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Nombre de ventes</label>
                    <input
                      type="number"
                      name="ventes"
                      value={addFormData.ventes}
                      onChange={handleInputChange}
                      placeholder="Ex: 156"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={addFormData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez le produit en détail..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Couleurs */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3">Couleurs disponibles *</label>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {addFormData.couleurs.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: colorMap[color] || '#cccccc' }}
                        />
                        <span className="text-sm font-medium">{color}</span>
                        <button
                          onClick={() => handleRemoveColorFromAdd(idx)}
                          className="text-red-500 hover:text-red-700 font-bold ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={addNewColor}
                      onChange={(e) => setAddNewColor(e.target.value)}
                      placeholder="Ex: Blanc, Gris, Noir..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
                    />
                    <button
                      onClick={handleAddColor}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleAddProduct}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter le produit
                </button>
                <button
                  onClick={handleCloseAddModal}
                  className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE VISUALISATION */}
      {selectedProduct && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.nom}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-64 flex items-center justify-center mb-6">
                {selectedProduct.imageUrl ? (
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.nom} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-8xl">{selectedProduct.image}</span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Référence:</span>
                      <span className="ml-2 font-mono text-gray-900">{selectedProduct.reference}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="ml-2 text-gray-900">{selectedProduct.categorie}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedProduct.dimensions.largeur} × {selectedProduct.dimensions.hauteur}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Stock:</span>
                      <span className="ml-2 font-semibold text-gray-900">{selectedProduct.stock} unités</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedProduct.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Couleurs disponibles</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProduct.couleurs.map((couleur, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: colorMap[couleur] || '#e5e7eb' }}
                        />
                        <span className="text-sm text-gray-700">{couleur}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">Prix:</span>
                    <span className="text-2xl font-bold text-blue-600">{selectedProduct.prixBase.toLocaleString()} DA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Ventes:</span>
                    <span className="text-lg font-semibold text-green-600">{selectedProduct.ventes}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => openEditModal(selectedProduct)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedProduct.id);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'ÉDITION */}
      {isEditing && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Modifier le produit</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Nom et Référence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Nom du produit</label>
                    <input
                      type="text"
                      value={editForm.nom}
                      onChange={(e) => handleEditChange('nom', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Référence</label>
                    <input
                      type="text"
                      value={editForm.reference}
                      onChange={(e) => handleEditChange('reference', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Catégorie et Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Catégorie</label>
                    <select
                      value={editForm.categorie}
                      onChange={(e) => handleEditChange('categorie', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Fenêtres">Fenêtres</option>
                      <option value="Portes">Portes</option>
                      <option value="Volets">Volets</option>
                      <option value="Baies vitrées">Baies vitrées</option>
                      <option value="Garde-corps">Garde-corps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Stock (unités)</label>
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => handleEditChange('stock', parseInt(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Largeur</label>
                    <input
                      type="text"
                      value={editForm.dimensions.largeur}
                      onChange={(e) => handleEditChange('dimensions', { ...editForm.dimensions, largeur: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Hauteur</label>
                    <input
                      type="text"
                      value={editForm.dimensions.hauteur}
                      onChange={(e) => handleEditChange('dimensions', { ...editForm.dimensions, hauteur: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Prix et Ventes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Prix (DA)</label>
                    <input
                      type="number"
                      value={editForm.prixBase}
                      onChange={(e) => handleEditChange('prixBase', parseInt(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Nombre de ventes</label>
                    <input
                      type="number"
                      value={editForm.ventes}
                      onChange={(e) => handleEditChange('ventes', parseInt(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleEditChange('description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Couleurs */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3">Couleurs disponibles</label>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {editForm.couleurs.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: colorMap[color] || '#cccccc' }}
                        />
                        <span className="text-sm font-medium">{color}</span>
                        <button
                          onClick={() => handleRemoveColorEdit(idx)}
                          className="text-red-500 hover:text-red-700 font-bold ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Ajouter une couleur..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddColorEdit()}
                    />
                    <button
                      onClick={handleAddColorEdit}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}