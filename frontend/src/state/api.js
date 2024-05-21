import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/Api" }),
  reducerPath: "adminApi",
  tagTypes: [
    "Entreprise",
    "Pack",
    "Subscription",
    "Service",
    "Message",
    "Products",
    "Clients",
    "Sales",
    "Dashboard",
    "Invoices",
    "Categorie",
    "Model",
    "Auth",
    "Fournisseurs",
    "BonCommandes",
    "BonLivraison",
    "Devi",
    "Demande",
    "Tax",
  ],
  endpoints: (build) =>({
    getEntreprise: build.query({
      query: (id) => `Entreprise/${id}`,
      providesTags: ["Entreprise"],
    }),
    getAllEntreprises: build.query({
      query: () => `Entreprise`,
      providesTags: ["Entreprise"],
    }),
    getOneEntreprise: build.query({
      query: (id) => `Entreprise/${id}`,
      providesTags: ["Entreprise"],
    }),
    getEntrepriseByGoogleId: build.query({
      query: (id) => `Entreprise/EntrepriseGoogle/${id}`,
      providesTags: ["Entreprise"],
    }),
    getEntrepriseDetail: build.query({
      query: (id) => `Entreprise/entreprisedetail/${id}`,
      providesTags: ["Entreprise"],
    }),
    getDashboard: build.query({
      query: () => `Entreprise/dashboard`,
      providesTags: ["Entreprise"],
    }),
    getEntrepriseState: build.query({
      query: () => `Entreprise/EnterpriseStat`,
      providesTags: ["Entreprise"],
    }),
    updateEntreprise: build.mutation({
      query: ({ id, entreprise }) => ({
        url: `Entreprise/edit/${id}`,
        method: "PUT",
        body: entreprise,
      }),
    }),
    removeEntreprise: build.mutation({
      query: (id) => ({
        url: `Entreprise/remove/${id}`,
        method: "DELETE",
      }),
    }),
    loginEntreprise: build.mutation({
      query: (loginData) => ({
        url: `Entreprise/login/`,
        method: "POST",
        body: loginData,
      }),
    }),
    registerEntreprise: build.mutation({
      query: (data) => ({
        url: `Entreprise/register/`,
        method: "POST",
        body: data,
      }),
    }),
    ForgoutPassword: build.mutation({
      query: (data) => ({
        url: `Entreprise/ForgoutPass/`,
        method: "POST",
        body: data,
      }),
    }),
    ResetPass: build.mutation({
      query: (data, id, token) => ({
        url: `Entreprise/reset-password/${id}/${token}`,
        method: "POST",
        body: data,
      }),
    }),
    ChangePasswordEntreprise: build.mutation({
      query: ({ id, oldPassword, newPassword }) => ({
        url: `Entreprise/changePassword/${id}`,
        method: "PUT",
        body: { oldPassword, newPassword },
      }),
    }),
    // Service
    getAllServices: build.query({
      query: () => `Service`,
      providesTags: ["Service"],
    }),
    addService: build.mutation({
      query: (serviceData) => ({
        url: `Service/add/`,
        method: "POST",
        body: serviceData,
      }),
    }),
    getOneService: build.query({
      query: (id) => `Service/${id}`,
      providesTags: ["Service"],
    }),
    updateService: build.mutation({
      query: ({ id, ServiceData }) => ({
        url: `Service/edit/${id}`,
        method: "PUT",
        body: ServiceData,
      }),
    }),
    removeService: build.mutation({
      query: (id) => ({
        url: `Service/remove/${id}`,
        method: "DELETE",
      }),
    }),
    getPacks: build.query({
      query: () => "Pack",
      providesTags: ["Pack"],
    }),
    getThreePacks: build.query({
      query: () => "Pack/ThreePacks",
      providesTags: ["Pack"],
      method: "GET",
    }),
    getAllPacksThreeService: build.query({
      query: () => "Pack/AllPacksThreeService",
      providesTags: ["Pack"],
      method: "GET",
    }),
    addPack: build.mutation({
      query: (PackData) => ({
        url: `Pack/add`,
        method: "POST",
        body: PackData,
      }),
    }),
    getOnePack: build.query({
      query: (id) => `Pack/${id}`,
      providesTags: ["Pack"],
    }),
    updatePack: build.mutation({
      query: ({ id, pack }) => ({
        url: `Pack/edit/${id}`,
        method: "PUT",
        body: pack,
      }),
    }),
    updatePackActive: build.mutation({
      query: ({ id, pack }) => ({
        url: `Pack/edit/active/${id}`,
        method: "PUT",
        body: pack,
      }),
    }),
    removePack: build.mutation({
      query: (id) => ({
        url: `Pack/remove/${id}`,
        method: "DELETE",
      }),
    }),

    // Subscription
    getSubscriptions: build.query({
      query: () => `Subscription`,
      providesTags: ["Subscription"],
    }),
    addSubscription: build.mutation({
      query: (SubscriptionData) => ({
        url: `Subscription/add`,
        method: "POST",
        body: SubscriptionData,
      }),
    }),
    getOneSubscription: build.query({
      query: (id) => `Subscription/${id}`,
      providesTags: ["Subscription"],
    }),
    getSubscriptionEnt: build.query({
      query: (id) => `Subscription/Entreprise/${id}`,
      providesTags: ["Subscription"],
    }),
    updateSubscription: build.mutation({
      query: ({ id, subscription }) => ({
        url: `Subscription/edit/${id}`,
        method: "PUT",
        body: subscription,
      }),
    }),
    removeSubscription: build.mutation({
      query: (id) => ({
        url: `Subscription/remove/${id}`,
        method: "DELETE",
      }),
    }),
    getMessages: build.query({
      query: () => `Message`,
      providesTags: ["Message"],
    }),
    addMessage: build.mutation({
      query: (messageData) => ({
        url: `Message/add/`,
        method: "POST",
        body: messageData,
      }),
    }),
    getAllMessages: build.query({
      query: () => `Message`,
      providesTags: ["Message"],
    }),
    getMessageAccepter: build.query({
      query: () => `Message/accepter`,
      providesTags: ["Message"],
    }),
    updateMessage: build.mutation({
      query: ({ id, MessageData }) => ({
        url: `Message/edit/${id}`,
        method: "PUT",
        body: MessageData,
      }),
    }), 
    removeMessage: build.mutation({
      query: (id) => ({
        url: `Message/remove/${id}`,
        method: "DELETE",
      }),
    }),
    getAllModels: build.query({
      query: () => `Model`,
      providesTags: ["Model"],
    }),
    addModel: build.mutation({
      query: (ModelData) => ({
        url: `Model/add/`,
        method: "POST",
        body: ModelData,
      }),
    }),
    getOneModel: build.query({
      query: (id) => `Model/${id}`,
      providesTags: ["Model"],
    }),
    updateModel: build.mutation({
      query: ({ id, ModelData }) => ({
        url: `Model/edit/${id}`,
        method: "PUT",
        body: ModelData,
      }),
    }),
    updateModelActive: build.mutation({
      query: ({ id, model }) => ({
        url: `Model/edit/active/${id}`,
        method: "PUT",
        body: model,
      }),
    }),
    removeModel: build.mutation({
      query: (id) => ({
        url: `Model/remove/${id}`,
        method: "DELETE",
      }),
    }),
    getUser: build.query({
      query: (id) => `Entreprise/${id}`,
      providesTags: ["Entreprise"],
    }),
    getInvoices: build.query({
      query: (id) => `Invoice/List/${id}`,
      providesTags: ["Invoices"],
    }),
    getOneInvoice: build.query({
      query: (id) => `Invoice/${id}`,
      providesTags: ["Invoices"],
    }),
    updateInvoice: build.mutation({
      query: ({ id, InvoiceData }) => ({
        url: `Invoice/edit/${id}`,
        method: "PUT",
        body: InvoiceData,
      }),
    }),
    addInvoice: build.mutation({
      query: (invoice) => ({
        url: `Invoice/add`,
        method: "POST",
        body: invoice,
      }),
    }),
    removeInvoice: build.mutation({
      query: (id) => ({
        url: `Invoice/remove/${id}`,
        method: "DELETE",
      }),
    }),
    addProduit: build.mutation({
      query: (produit) => ({
        url: `Produit/add`,
        method: "POST",
        body: produit,
      }),
    }),
    getProducts: build.query({
      query: (id) => `Produit/Entreprise/${id}`,
      providesTags: ["Products"],
    }),
    getOneProduit: build.query({
      query: (id) => `Produit/${id}`,
      providesTags: ["Products"],
    }),
    updateProduit: build.mutation({
      query: ({ id, ProduitData }) => ({
        url: `Produit/edit/${id}`,
        method: "PUT",
        body: ProduitData,
      }),
    }),
    removeProduit: build.mutation({
      query: (id) => ({
        url: `Produit/remove/${id}`,
        method: "DELETE",
      }),
    }),
    addClient: build.mutation({
      query: (client) => ({
        url: `Client/add`,
        method: "POST",
        body: client,
      }),
    }),
    getClients: build.query({
      query: (id) => `Client/Entreprise/${id}`,
      providesTags: ["Clients"],
    }),
    getOneClient: build.query({
      query: (id) => `Client/${id}`,
      providesTags: ["Clients"],
    }),
    updateClient: build.mutation({
      query: ({ id, client }) => ({
        url: `Client/edit/${id}`,
        method: "PUT",
        body: client,
      }),
    }),
    removeClient: build.mutation({
      query: (id) => ({
        url: `Client/remove/${id}`,
        method: "DELETE",
      }),
    }),

    addFournisseur: build.mutation({
      query: (fournisseur) => ({
        url: `Fournisseur/add`,
        method: "POST",
        body: fournisseur,
      }),
    }),
    getFournisseurs: build.query({
      query: (id) => `Fournisseur/Entreprise/${id}`,
      providesTags: ["Fournisseurs"],
    }),
    getOneFournisseur: build.query({
      query: (id) => `Fournisseur/${id}`,
      providesTags: ["Fournisseurs"],
    }),
    updateFournisseur: build.mutation({
      query: ({ id, fournisseur }) => ({
        url: `Fournisseur/edit/${id}`,
        method: "PUT",
        body: fournisseur,
      }),
    }),
    removeFournisseur: build.mutation({
      query: (id) => ({
        url: `Fournisseur/remove/${id}`,
        method: "DELETE",
      }),
    }),

    getSales: build.query({
      query: () => "Invoice/summary",
      providesTags: ["Sales"],
    }),
    sendEmail: build.mutation({
      query: ({ clientEmail, clientName, userName, invoiceNumber, itemsTable, amount, formattedDueDate,
         userPhone,userAddress,userEmail
       }) => ({
        url: `Invoice/email`,
        method: "POST",
        body: { clientEmail, clientName, userName, invoiceNumber, itemsTable, amount, formattedDueDate,
          userPhone,userAddress,userEmail
        },
      }),
    }),
    getDashboardClient: build.query({
      query: (id) => `Invoice/dashboard/${id}`,
      providesTags: ["Dashboard"],
    }),
    getInvoiceDetails: build.query({
      query: (id) => `Invoice/details/${id}`,
      providesTags: ["Invoices"],
    }),
    addCategory: build.mutation({
      query: (categorieData) => ({
        url: `Categorie/add/`,
        method: "POST",
        body: categorieData,
      }),
    }),
    getAllCategories: build.query({
      query: (id) => `Categorie/Entreprise/${id}`,
      providesTags: ["Categorie"],
    }),
    getOneCategorie: build.query({
      query: (id) => `Categorie/${id}`,
      providesTags: ["Categorie"],
    }),
    updateCategorie: build.mutation({
      query: ({ id, categorie }) => ({
        url: `Categorie/edit/${id}`,
        method: "PUT",
        body: categorie,
      }),
    }),
    removeCategorie: build.mutation({
      query: (id) => ({
        url: `Categorie/remove/${id}`,
        method: "DELETE",
      }),
    }),
    getOneAuth: build.query({
      query: () => `auth/google/`,
      providesTags: ["Auth"],
    }),

    // Bon de commandes
    getBonCommandes: build.query({
      query: (id) => `BonCommandes/List/${id}`,
      providesTags: ["BonCommandes"],
    }),
    getOneBonCommande: build.query({
      query: (id) => `BonCommandes/${id}`,
      providesTags: ["BonCommandes"],
    }),
    updateBonCommande: build.mutation({
      query: ({ id, bonCommandeData }) => ({
        url: `BonCommandes/edit/${id}`,
        method: "PUT",
        body: bonCommandeData,
      }),
    }),
    addBonCommande: build.mutation({
      query: (bonCommande) => ({
        url: `BonCommandes/add`,
        method: "POST",
        body: bonCommande,
      }),
    }),
    getBonCommandeDetails: build.query({
      query: (id) => `BonCommandes/details/${id}`,
      providesTags: ["BonCommandes"],
    }),
    removeBonCommande: build.mutation({
      query: (id) => ({
        url: `BonCommandes/remove/${id}`,
        method: "DELETE",
      }),
    }),

    // Bon de Livraison
    getBonLivraison: build.query({
      query: (id) => `BonLivraison/List/${id}`,
      providesTags: ["BonLivraison"],
    }),
    getOneBonLivraison: build.query({
      query: (id) => `BonLivraison/${id}`,
      providesTags: ["BonLivraison"],
    }),
    updateBonLivraison: build.mutation({
      query: ({ id, BonLivraisonData }) => ({
        url: `BonLivraison/edit/${id}`,
        method: "PUT",
        body: BonLivraisonData,
      }),
    }),
    addBonLivraison: build.mutation({
      query: (bonLivraison) => ({
        url: `BonLivraison/add`,
        method: "POST",
        body: bonLivraison,
      }),
    }),
    getBonLivraisonDetails: build.query({
      query: (id) => `BonLivraison/details/${id}`,
      providesTags: ["BonLivraison"],
    }),
    removeBonLivraison: build.mutation({
      query: (id) => ({
        url: `BonLivraison/remove/${id}`,
        method: "DELETE",
      }),
    }),

    // Devi
    getDevis: build.query({
      query: (id) => `Devi/List/${id}`,
      providesTags: ["Devi"],
    }),
    getOneDevi: build.query({
      query: (id) => `Devi/${id}`,
      providesTags: ["Devi"],
    }),
    updateDevi: build.mutation({
      query: ({ id, deviData }) => ({
        url: `Devi/edit/${id}`,
        method: "PUT",
        body: deviData,
      }),
    }),
    addDevi: build.mutation({
      query: (devi) => ({
        url: `Devi/add`,
        method: "POST",
        body: devi,
      }),
    }),
    getDeviDetails: build.query({
      query: (id) => `Devi/details/${id}`,
      providesTags: ["Devi"],
    }),
    removeDevi: build.mutation({
      query: (id) => ({
        url: `Devi/remove/${id}`,
        method: "DELETE",
      }),
    }),

    // Demande
    getDemandes: build.query({
      query: (id) => `Demande`,
      providesTags: ["Demande"],
    }),
    getOneDemande: build.query({
      query: (id) => `Demande/${id}`,
      providesTags: ["Demande"],
    }),
    updateDemande: build.mutation({
      query: ({ id, DemandeData }) => ({
        url: `Demande/edit/${id}`,
        method: "PUT",
        body: DemandeData,
      }),
    }),
    addDemande: build.mutation({
      query: (Demande) => ({
        url: `Demande/add`,
        method: "POST",
        body: Demande,
      }),
    }),
    removeDemande: build.mutation({
      query: (id) => ({
        url: `Demande/remove/${id}`,
        method: "DELETE",
      }),
    }),

    // Taks 
    getAllTaxEntreprise: build.query({
      query: (id) => `Tax/Entreprise/${id}`,
      providesTags: ["Tax"],
    }),
    AddTaks: build.mutation({
      query: (TaksData) => ({
        url: `Tax/add/`,
        method: "POST",
        body: TaksData,
      }),
    }),
    getOneTax: build.query({
      query: (id) => `Tax/${id}`,
      providesTags: ["Tax"],
    }),
    updateTax: build.mutation({
      query: ({ id, taxData }) => ({
        url: `Tax/edit/${id}`,
        method: "PUT",
        body: taxData,
      }),
    }) ,
    removeTaks: build.mutation({
      query: (id) => ({
        url: `Tax/remove/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});


export const {
  useGetEntrepriseQuery,
  useGetAllEntreprisesQuery,
  useGetOneEntrepriseQuery,
  useGetEntrepriseStateQuery,
  useGetEntrepriseDetailQuery,
  useGetDashboardQuery,
  useUpdateEntrepriseMutation,
  useRemoveEntrepriseMutation,
  useLoginEntrepriseMutation,
  useRegisterEntrepriseMutation,
  useGetEntrepriseByGoogleIdQuery,
  useForgoutPasswordMutation,
  useResetPassMutation,
  useChangePasswordEntrepriseMutation,

  useGetPacksQuery,
  useGetOnePackQuery,
  useAddPackMutation,
  useUpdatePackMutation,
  useRemovePackMutation,
  useGetThreePacksQuery,
  useGetAllPacksThreeServiceQuery,
  useUpdatePackActiveMutation,

  useGetAllServicesQuery,
  useGetOneServiceQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useRemoveServiceMutation,

  useGetAllModelsQuery,
  useGetOneModelQuery,
  useAddModelMutation,
  useUpdateModelMutation,
  useRemoveModelMutation,
  useUpdateModelActiveMutation,

  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useRemoveSubscriptionMutation,
  useGetOneSubscriptionQuery,
  useGetSubscriptionEntQuery,

  useGetMessagesQuery,
  useGetMessageAccepterQuery,
  useRemoveMessageMutation,
  useGetAllMessagesQuery,
  useAddMessageMutation,
  useUpdateMessageMutation,

  useAddInvoiceMutation,
  useGetUserQuery,
  useGetInvoicesQuery,
  useRemoveInvoiceMutation,
  useGetSalesQuery,
  useGetDashboardClientQuery,

  useGetProductsQuery,
  useAddProduitMutation,
  useGetOneProduitQuery,
  useUpdateProduitMutation,
  useRemoveProduitMutation,

  useAddClientMutation,
  useGetOneClientQuery,
  useUpdateClientMutation,
  useRemoveClientMutation,
  useGetClientsQuery,

  useGetFournisseursQuery,
  useGetOneFournisseurQuery,
  useAddFournisseurMutation,
  useUpdateFournisseurMutation,
  useRemoveFournisseurMutation,

  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useGetOneCategorieQuery,
  useUpdateCategorieMutation,
  useRemoveCategorieMutation,

  useSendEmailMutation,

  useGetInvoiceDetailsQuery,

  useGetOneInvoiceQuery,
  useUpdateInvoiceMutation,
  useGetOneAuthQuery,

  // bon de commandes
  useGetBonCommandesQuery,
  useAddBonCommandeMutation,
  useGetBonCommandeDetailsQuery,
  useGetOneBonCommandeQuery,
  useUpdateBonCommandeMutation,
  useRemoveBonCommandeMutation,

  // bon de livraison
  useGetBonLivraisonQuery,
  useAddBonLivraisonMutation,
  useGetBonLivraisonDetailsQuery,
  useGetOneBonLivraisonQuery,
  useUpdateBonLivraisonMutation,
  useRemoveBonLivraisonMutation,

  // Devi
  useGetDevisQuery,
  useAddDeviMutation,
  useGetDeviDetailsQuery,
  useGetOneDeviQuery,
  useUpdateDeviMutation,
  useRemoveDeviMutation,

  // Demande
  useGetDemandesQuery,
  useGetOneDemandeQuery,
  useUpdateDemandeMutation,
  useAddDemandeMutation,
  useRemoveDemandeMutation,

  //Taks
  useGetAllTaxEntrepriseQuery,
  useAddTaksMutation,
  useRemoveTaksMutation,
  useGetOneTaxQuery,
  useUpdateTaxMutation
} = api;