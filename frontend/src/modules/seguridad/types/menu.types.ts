export interface PxpMenuItem {
  id_gui: number | string;
  text: string;
  component?: string;
  type: "carpeta" | "hoja";
  icon?: string;
  childrens?: PxpMenuItem[];
  href?: string;
  badge?: string;
}

export interface ListarMenuParams {
  system?: string;
  mobile?: number;
}

