import nike from "../assets/images/nike.png";
import nike2 from "../assets/images/nike2.png";
import nike3 from "../assets/images/nike3.png";
import nike4 from "../assets/images/nike4.png";
import nike7 from "../assets/images/nike7.png";
import nike8 from "../assets/images/nike8.png";
import nike9 from "../assets/images/nike9.png";
import nike10 from "../assets/images/nike10.png";
import man from "../assets/images/man.png";
import woman from "../assets/images/woman.png";
import kid from "../assets/images/kid.png";

import nikeLogo from "../assets/images/nikeLogo.png";
import adidasLogo from "../assets/images/adidasLogo.jpg";
import pumaLogo from "../assets/images/pumaLogo.png";

import puma2 from "../assets/images/puma2.png";
import puma1 from "../assets/images/puma1.png";
import puma4 from "../assets/images/puma4.png";
import puma3 from "../assets/images/puma3.png";

import adidas from "../assets/images/adidas.png";
import adidas2 from "../assets/images/adidas2.png";
import adidas3 from "../assets/images/adidas3.png";
import adidas4 from "../assets/images/adidas4.png";
import kids from "../assets/images/kids.png";
import kids2 from "../assets/images/kids2.png";
import kids3 from "../assets/images/kids3.png";
import kids4 from "../assets/images/kids4.png";
import { GiRunningShoe } from "react-icons/gi";
import { IoIosMan, IoIosWoman } from "react-icons/io";
import { FaChild } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { IoHomeSharp } from "react-icons/io5";

export const slides = [
  { slide: nike10, caption: "Just do it" },
  { slide: adidas, caption: "Impossible is nothing" },
  { slide: puma2, caption: "Forever Faster" },
  { slide: kids, caption: "Kids Collection" },
];

export const menu = [
  {
    name: "Home",
    icon: IoHomeSharp,
    path: "/",
    children: [], // no subcategories
  },
  {
    name: "Products",
    icon: GiRunningShoe,
    path: "/products",
    children: [
      { name: "Nike", path: "/products/nike" },
      { name: "Adidas", path: "/products/adidas" },
      { name: "Puma", path: "/products/puma" },
      { name: "Under Armour", path: "/products/UnderArmour" },
    ],
  },
  {
    name: "Men",
    icon: IoIosMan,
    path: "/men",
    children: [
      { name: "Sneakers", path: "/men/sneakers" },
      { name: "Clothing", path: "/men/clothing" },
      { name: "Accessories", path: "/men/accessories" },
      { name: "Sportswear", path: "/men/sportswear" },
    ],
  },
  {
    name: "Women",
    icon: IoIosWoman,
    path: "/women",
    children: [
      { name: "Nike", path: "/women/nike" },
      { name: "Adidas", path: "/women/puma" },
      { name: "Puma", path: "/women/accessories" },
    ],
  },
  {
    name: "Kids",
    icon: FaChild,
    path: "/kids",
    children: [
      { name: "Nike", path: "/kids/nike" },
      { name: "Adidas", path: "/kids/adidas" },
      { name: "Puma", path: "/kids/puma" },
    ],
  },
];

export const products = [
  {
    id: 1,
    name: "PUMA FAST-R NITRO",
    category: "Women",
    brand: "Puma",
    oldPrice: 25,
    newPrice: 20,
    images: [puma2, puma1, puma3, puma4],
    stock: 5,
  },
  {
    id: 2,
    name: "Adidas Ultraboost 22",
    category: "Women",
    brand: "Adidas",
    oldPrice: 30,
    newPrice: 27,
    images: [adidas, adidas2, adidas3, adidas4],
    stock: 7,
  },
  {
    id: 3,
    name: "Nike GT Hustle ",
    category: "Men",
    brand: "Adidas",
    oldPrice: 40,
    newPrice: 38,
    images: [nike, nike2, nike3, nike4],
    stock: 2,
  },
  {
    id: 4,
    name: "Nike IsoFly",
    category: "Kids",
    brand: "Nike",
    oldPrice: 47,
    newPrice: 44,
    images: [kids, kids2, kids3, kids4],
    stock: 3,
  },
  {
    id: 5,
    name: "Nike Air Max ",
    category: "Women",
    brand: "Nike",
    oldPrice: 47,
    newPrice: 44,
    images: [nike10, nike7, nike8, nike9],
    stock: 3,
  },
];

export const categories = [
  { image: man, category: "Men" },
  { image: woman, category: "Women" },
  { image: kid, category: "Kids" },
];
export const brands = [
  { image: nikeLogo, brand: "Nike" },
  { image: adidasLogo, brand: "Adidas" },
  { image: pumaLogo, brand: "Puma" },
];
