const mongoose = require('mongoose');
const fs = require('fs');

const BonCommandeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true },
    fournisseurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fournisseur",
      required: true,
    },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number },
      },
    ],
    taxes: [
      {
        taxId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Taks",
          required: true,
        }
      }
    ],
    status: { type: String, enum: ["attent de traitement", "au cour de traitement", "expédié"], default: "attent de traitement" },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BonLivraisonSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true },
    bonCommandeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BonCommande",
      required: true,
    },
    dateLivraison: { type: Date, required: true },
    status: {
      type: String,
      enum: ["attent de confirmation", "confirmé", "attent de reception"],
      default: "attent de confirmation",
    },
    amount: { type: Number, required: true }, 
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  categoryName: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const ClientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  active: { type: Boolean, default: true },
},
{timestamps: true}
);

const DemandeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true },
    packId: { type: mongoose.Schema.Types.ObjectId, ref: "Pack", required: true },
    nombreAnnee: { type: String },
    status: {
      type: String,
      enum: ["en attent", "accepter", "rejeter"],
      default: "en attent",
    },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DeviSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true  },
  date: { type: Date, required: true },
  items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number } 
  }],
  taxes: [
    {
      taxId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Taks",
        required: true,
      }
    }
  ],
  status: { type: String, enum: ["attente d'approbation", 'approuvé', 'rejeté'], default: "attente d'approbation" },
  amount: { type: Number, required: true },
  active: { type: Boolean, default: true },
},
{timestamps: true}
);

const EnterpriseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String,  },
    role: { type: String, default: 'standart'},
    subscription: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    phone: { type: String },
    address: { type: String},
    logo: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    googleId : String,
    signature: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  {timestamps: true}
);

const FournisseurSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  active: { type: Boolean, default: true },
},
{timestamps: true}
);

const InvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number } 
  }],
  taxes: [
    {
      taxId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Taks",
        required: true,
      }
    }
  ],
  status: { type: String, enum: ['sent', 'paid', 'late'], default: 'sent' },
  amount: { type: Number, required: true },
  active: { type: Boolean, default: true },
},
{timestamps: true}
);

const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["accepter", "Désactiver"], default: "Désactiver" },
},
  {timestamps: true}
);

const ModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  active: { type: Boolean, default: true },
});

const PackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  services : [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  }],
  price: { type: Number, required: true },
  logo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  active: { type: Boolean, default: true },
},
{timestamps: true}
);

const ProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: {type: Number, required: true},
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

const ServiceSchema = new mongoose.Schema({
  ServiceName: { type: String, required: true },
  active: { type: Boolean, default: true },
});


const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  packId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pack', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
});

const TaksShema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
  TaksValleur: { type: Number, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
});

// Ajoutez tous vos schémas dans ce tableau
const schemas = [
  { name: 'BonCommande', schema: BonCommandeSchema },
  { name: 'BonLivraison', schema: BonLivraisonSchema },
  { name: 'Category', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    categoryName: { type: String, required: true },
    active: { type: Boolean, default: true },
  })},
  { name: 'Client', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    active: { type: Boolean, default: true },
  }, {timestamps: true})},
  { name: 'Demande', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise", required: true },
    packId: { type: mongoose.Schema.Types.ObjectId, ref: "Pack", required: true },
    nombreAnnee: { type: String },
    status: { type: String, enum: ["en attent", "accepter", "rejeter"], default: "en attent" },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  }, {timestamps: true})},
  { name: 'Devi', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number } 
    }],
    taxes: [
      {
        taxId: { type: mongoose.Schema.Types.ObjectId, ref: "Taks", required: true },
      }
    ],
    status: { type: String, enum: ["attente d'approbation", 'approuvé', 'rejeté'], default: "attente d'approbation" },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  }, {timestamps: true})},
  { name: 'Enterprise', schema: new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'standart'},
    subscription: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    phone: { type: String },
    address: { type: String},
    logo: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    googleId : String,
    signature: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  }, {timestamps: true})},
  { name: 'Fournisseur', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    active: { type: Boolean, default: true },
  }, {timestamps: true})},
  { name: 'Invoice', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number }
    }],
    taxes: [
      {
        taxId: { type: mongoose.Schema.Types.ObjectId, ref: "Taks", required: true },
      }
    ],
    status: { type: String, enum: ['sent', 'paid', 'late'], default: 'sent' },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  }, {timestamps: true})},
  { name: 'Message', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["accepter", "Désactiver"], default: "Désactiver" },
  }, {timestamps: true})},
  { name: 'Model', schema: new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    active: { type: Boolean, default: true },
  })},
  { name: 'Pack', schema: new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    services : [{
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    }],
    price: { type: Number, required: true },
    logo: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    active: { type: Boolean, default: true },
  }, {timestamps: true})},
  { name: 'Product', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },
  })},
  { name: 'Service', schema: new mongoose.Schema({
    ServiceName: { type: String, required: true },
    active: { type: Boolean, default: true },
  })},
  { name: 'Subscription', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    packId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pack', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  })},
  { name: 'Taks', schema: new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise', required: true },
    TaksValleur: { type: Number, required: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
  })}
];

// Créer un objet pour stocker tous les schémas
const allSchemas = {};
schemas.forEach(({ name, schema }) => {
  allSchemas[name] = schema.obj;
});

// Convertir l'objet en JSON et l'écrire dans un fichier
const jsonSchemas = JSON.stringify(allSchemas, null, 2);
fs.writeFileSync('allSchemas.json', jsonSchemas);

console.log('Tous les schémas exportés en un seul fichier JSON.');