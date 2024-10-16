import drugIcon from '@/images/svg/drug.svg'
import ingredientIcon from '@/images/svg/ingredient.svg'
import diseaseIcon from '@/images/svg/disease.svg'
import interactionIcon from '@/images/svg/interaction.svg'
import purchaseIcon from '@/images/svg/purchase.svg'
import inventoryIcon from '@/images/svg/inventory.svg'
import priceIcon from '@/images/svg/price.svg'
import debitIcon from '@/images/svg/debit.svg'
import userIcon from '@/images/svg/user.svg'
import MainMenuContainer from './MainMenuContainer';
import MainMenuItem from './MainMenuItem';
import SubMenuContainer from './SubMenuContainer';
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

export default function Menu() {

  const[mainMenuActive, setMainMenuActive] = useState('');
  const[itemMenuActive, setItemMenuActive] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = {
    "/drugs": "drugs",
    "/drugs/add": "drugs",

    "/active-ingredients": "active-ingredients",
    "/active-ingredients/add": "active-ingredients",

    "/diseases": "diseases",
    "/diseases/add": "diseases",

    "/interactions": "interactions",
    "/interactions/add": "interactions",

    "/purchases": "purchases",
    "/purchases/returns": "purchases",
    "/purchases/add": "purchases",

    "/inventory": "inventory",

    "/prices": "prices",

    "/debits": "debits",

    "/users": "users",
    "/users/add": "users",

  }

  const mainMenuItem = menuItems[location.pathname] || null;

  useEffect(()=>{
      setMainMenuActive(mainMenuItem);
  }, [mainMenuItem])

  useEffect(()=>{

    if(location.pathname == '/')
      navigate("/drugs/add");

    setItemMenuActive(location.pathname);
  }, [location.pathname])

  function handleMainMenuItemClick(item) {
    setMainMenuActive(item);
  }

    return (
      <>
        <MainMenuContainer>
          <MainMenuItem 
          active={mainMenuActive === "drugs"}
          onClick={()=>{handleMainMenuItemClick("drugs")}} 
          title="Drugs" 
          icon={drugIcon} />
          {
            (mainMenuActive === "drugs")
            &&
            <SubMenuContainer>
              <Link
              to="/drugs/add"
              className={itemMenuActive == "/drugs/add" ? "sub-menu-item active" : "sub-menu-item"}>
                Add New
              </Link> 

              <Link 
              to="/drugs"
              className={itemMenuActive == "/drugs" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === "active-ingredients")} 
          onClick={()=>handleMainMenuItemClick("active-ingredients")} 
          title="Active Ingredients" 
          icon={ingredientIcon} />
          {
            (mainMenuActive === "active-ingredients")
            &&
            <SubMenuContainer>
              <Link
              to="/active-ingredients/add"
              className={itemMenuActive == "/active-ingredients/add" ? "sub-menu-item active" : "sub-menu-item"}>
                Add New
              </Link> 
              <Link 
              to="/active-ingredients"
              className={itemMenuActive == "/active-ingredients" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === "diseases")}
          onClick={()=>handleMainMenuItemClick("diseases")} 
          title="Diseases" 
          icon={diseaseIcon} />
          {
            (mainMenuActive === "diseases")
            &&
            <SubMenuContainer>
              <Link
              to="/diseases/add"
              className={itemMenuActive == "/diseases/add" ? "sub-menu-item active" : "sub-menu-item"}>
                Add New
              </Link> 
              <Link 
              to="/diseases"
              className={itemMenuActive == "/diseases" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
            }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === "interactions")} 
          onClick={()=>handleMainMenuItemClick("interactions")} 
          title="Interactions" 
          icon={interactionIcon} />
          {
            (mainMenuActive === "interactions")
            &&
            <SubMenuContainer>
              <Link
              to="/interactions/add"
              className={itemMenuActive == "/interactions/add" ? "sub-menu-item active" : "sub-menu-item"}>
                Add New
              </Link> 
              <Link 
              to="/interactions"
              className={itemMenuActive == "/interactions" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === "purchases")} 
          onClick={()=>handleMainMenuItemClick("purchases")} 
          title="Purchases" 
          icon={purchaseIcon} />
          {
            (mainMenuActive === "purchases")
            &&
            <SubMenuContainer>
              <Link
              to="/purchases/add"
              className={itemMenuActive == "/purchases/add" ? "sub-menu-item active" : "sub-menu-item"}>
                Add New
              </Link> 
              <Link 
              to="/purchases"
              className={itemMenuActive == "/purchases" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
              <Link 
              to="/purchases/returns"
              className={itemMenuActive == "/purchases/returns" ? "sub-menu-item active" : "sub-menu-item"}>
                List All Returns
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === 'inventory')} 
          onClick={()=>handleMainMenuItemClick('inventory')} 
          title="Inventory" 
          icon={inventoryIcon} />
          {
            (mainMenuActive === 'inventory')
            &&
            <SubMenuContainer>
              <Link 
              to="/inventory"
              className={itemMenuActive == "/inventory" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === "prices")} 
          onClick={()=>handleMainMenuItemClick("prices")} 
          title="Prices" 
          icon={priceIcon} />
          {
            (mainMenuActive === "prices")
            &&
            <SubMenuContainer>
              <Link 
              to="/prices"
              className={itemMenuActive == "/prices" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === "debits")} 
          onClick={()=>handleMainMenuItemClick("debits")} 
          title="Debits" 
          icon={debitIcon} />
          {
            (mainMenuActive === "debits")
            &&
            <SubMenuContainer>
              <Link 
              to="/debits"
              className={itemMenuActive == "/debits" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>

        <MainMenuContainer>
          <MainMenuItem 
          active={(mainMenuActive === "users")} 
          onClick={()=>handleMainMenuItemClick("users")} 
          title="Users" 
          icon={userIcon} />
          {
            (mainMenuActive === "users")
            &&
            <SubMenuContainer>
              <Link 
              to="/users/add"
              className={itemMenuActive == "/users/add" ? "sub-menu-item active" : "sub-menu-item"}>
                Add New
              </Link>
              <Link 
              to="/users"
              className={itemMenuActive == "/users" ? "sub-menu-item active" : "sub-menu-item"}>
                List All
              </Link>
            </SubMenuContainer>
          }
        </MainMenuContainer>
      </>
    );
}