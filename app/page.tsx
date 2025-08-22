"use client";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navigation = [
  {
    url: "/dashboard/diligenciar",
    text: "Diligenciar Manifiesto",
    descripcion: "Llena y gestiona formularios de manifiestos",
    role: ["admin", "conductor", "superAdmin"],
  },
  {
    url: "/dashboard/manifiesto",
    text: "Lista de Servicios",
    descripcion: "Administra los manifiestos / servicios creados",
    role: ["admin", "conductor", 'superAdmin', 'comercio'],
  },
  {
    url: "/dashboard/manifiesto-comercial",
    text: "Área Comercial",
    descripcion: "Administra los manifiestos / Cotizaciones",
    role: ["admin", "comercio", 'superAdmin'],
  },
  {
    url: "/dashboard/cliente",
    text: "Clientes",
    descripcion: "Gestiona la información de los clientes",
    role: ["admin", "superAdmin"],
  },
  {
    url: "/dashboard/item",
    text: "Items",
    descripcion: "Administra los ítems disponibles en los manifiestos",
    role: ["admin", "superAdmin"],
  },
  {
    url: "/dashboard/plantilla",
    text: "Plantillas",
    descripcion: "Crea y edita plantillas predefinidas",
    role: ["admin", "superAdmin"],
  },
  {
    url: "/dashboard/usuario",
    text: "Usuarios",
    descripcion: "Gestiona los usuarios y sus roles",
    role: ["superAdmin"],
  },
]

export default function Home() {
  const router = useRouter();
  const { user} = useAuth()

  const handleLogout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    router.replace("/auth/login");
  };


  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);

  if ( user ) return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center text-azul mb-8">
        Menú Principal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {navigation
          .filter((option) => option.role.includes(user.rol.name))
          .map((option, i) => (
            <Link key={i} href={option.url}>
              <div
                className={`p-6 border rounded-lg shadow hover:shadow-lg transition cursor-pointer ${
                  i % 2 === 0 ? "bg-verde text-white" : "bg-azul text-white"
                }`}
              >
                <h2 className="text-lg font-semibold text-white">
                  {option.text}
                </h2>
                <p className="text-sm text-white mt-1">
                  {option.descripcion}
                </p>
              </div>
            </Link>
          ))}

      </div>

      <div className="text-center mt-5">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
        >
          Cerrar Sesión
        </button>
      </div>

    </main>
  );
}
