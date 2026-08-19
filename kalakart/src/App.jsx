import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import IntroStats from "./components/IntroStats";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import ArtisanSection from "./components/ArtisanSection";
import Footer from "./components/Footer";

import Auth from "./components/Auth";
import Checkout from "./components/Checkout"; 
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import CartDrawer from "./components/CartDrawer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <IntroStats />
        <CategorySection />
        <ProductSection />
        <ArtisanSection />
      </main>

      <Footer />

      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* AUTH */}
        <Route
          path="/auth"
          element={<Auth />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* PREVIOUS ORDERS */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

      </Routes>
    </BrowserRouter>
  );
}