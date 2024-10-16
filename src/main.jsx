import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './layout/Dashboard';
import PriceListContainer from './components/prices/PriceListContainer';
import DebitListContainer from './components/debits/DebitListContainer';
import InventoryListContainer from './components/inventory/InventoryListContainer';
import UserListContainer from './components/users/UserListContainer';
import UserFormContainer from './components/users/UserFormContainer';
import DiseaseListContainer from './components/disease/DiseaseListContainer';
import DiseaseFormContainer from './components/disease/DiseaseFormContainer';
import ActiveIngredientListContainer from './components/activeingredients/ActiveIngredientListContainer';
import ActiveIngredientFormContainer from './components/activeingredients/ActiveIngredientFormContainer';
import DrugIntractionListContainer from './components/interactions/DrugInteractionListContainer';
import DrugInteractionFormContainer from './components/interactions/DrugInteractionFormContainer';
import PurchaseBillListContainer from './components/purchasebills/PurchaseBillListContainer';
import PurchaseBillViewContainer from './components/purchasebills/PurchaseBillViewContainer';
import PurchaseBillFormContainer from './components/purchasebills/PurchaseBillFormContainer';
import PurchaseReturnBillListContainer from './components/purchasereturnbills/PurchaseReturnBillListContainer';
import PurchaseReturnBillViewContainer from './components/purchasereturnbills/PurchaseReturnBillViewContainer';
import PurchaseReturnBillFormContainer from './components/purchasereturnbills/PurchaseReturnBillFormContainer';
import DrugListContainer from './components/drugs/DrugListContainer';
import DrugFormContainer from './components/drugs/DrugFormContainer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "drugs",
        children: [
          {
            path: ":drugId",
            element:<DrugFormContainer />
          },
          {
            path: "add",
            element: <DrugFormContainer />
          },
          {
            index: true,
            element: <DrugListContainer />
          }
        ]
      },
      {
        path: "active-ingredients",
        children: [
          {
            path: "add",
            element: <ActiveIngredientFormContainer />
          },
          {
            path: "edit/:activeIngredientId",
            element: <ActiveIngredientFormContainer />
          },
          {
            index: true,
            element: <ActiveIngredientListContainer />
          }
        ]
      },
      {
        path: "diseases",
        children: [
          {
            path: "add",
            element: <DiseaseFormContainer />
          },
          {
            path: "edit/:diseaseId",
            element: <DiseaseFormContainer />
          },
          {
            index: true,
            element: <DiseaseListContainer />
          }
        ]
      },
      {
        path: "interactions",
        children: [
          {
            path: "add",
            element: <DrugInteractionFormContainer />
          },
          {
            path: "edit/:drugInteractionId",
            element: <DrugInteractionFormContainer />
          },
          {
            index: true,
            element: <DrugIntractionListContainer />
          }
        ]
      },
      {
        path: "purchases",
        children: [
          {
            path: ":purchaseBillId",
            children: [
              {
                path: "edit",
                element: <PurchaseBillFormContainer />
              },
              {
                path: "returns",
                children: [
                  {
                    path: ":purchaseReturnBillId",
                    children: [
                      {
                        path: "edit",
                        element: <PurchaseReturnBillFormContainer />
                      },
                      {
                        index: true,
                        element: <PurchaseReturnBillViewContainer />
                      }
                    ]
                  },
                  {
                    index: true,
                    element: <PurchaseReturnBillListContainer />
                  }
                ]
              },
              {
                index: true,
                element: <PurchaseBillViewContainer />
              }
            ]
          },
          {
            path: "add",
            element: <PurchaseBillFormContainer />
          },
          {
            index: true,
            element: <PurchaseBillListContainer />
          },
          {
            path: "returns",
            element: <PurchaseReturnBillListContainer />
          }
        ]
      },
      {
        path: "inventory",
        element: <InventoryListContainer />
      },
      {
        path: "prices",
        element: <PriceListContainer />
      },
      {
        path: "debits",
        element: <DebitListContainer />
      },
      {
        path: "users",
        children: [
          {
            path: "add",
            element: <UserFormContainer />
          },
          {
            path: "edit/:userId",
            element: <UserFormContainer />
          },
          {
            index: true,
            element: <UserListContainer />
          }
        ]
      }
    ]
  },
]);

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
