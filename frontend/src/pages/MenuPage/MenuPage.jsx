import { Button, Paper, Stack, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import style from "./MenuPage.module.css";
import Header from "../../components/Header/Header";
import { InventoryProvider } from "../../context/InventoryContext";

const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <InventoryProvider>
      <div className={style.page}>
        {/* We pass isMenu to the header so it selectively hides Game UI elements */}
        <Header isMenu={true} />
        
        <div className={style.contentWrapper}>
          <div className={style.layout}>
            <Paper className={style.menuPanel} radius="28px" shadow="xl">
              <Title order={2} className={style.menuTitle}>
                Main Menu
              </Title>
              
              <Stack gap="md" w="100%">
                <Button 
                  className={style.menuButton} 
                  radius="xl" 
                  fullWidth 
                  onClick={() => navigate("/game")}
                >
                  New Game
                </Button>
                
                <Button 
                  className={style.secondaryButton} 
                  variant="subtle" 
                  radius="xl" 
                  fullWidth
                  onClick={() => alert("Load Game feature coming soon!")}
                >
                  Load Game
                </Button>
                
                <Button 
                  className={style.secondaryButton} 
                  variant="subtle" 
                  radius="xl" 
                  fullWidth
                  onClick={() => alert("Settings feature coming soon!")}
                >
                  Settings
                </Button>
              </Stack>
            </Paper>
          </div>
        </div>
      </div>
    </InventoryProvider>
  );
};

export default MenuPage;
