import { useSelector } from "react-redux";
import { useMemo } from "react";

const usePermissionsByModule = (moduleName) => {
  const user = useSelector((state) => state.user.loggedUser);

  return useMemo(() => {
    // 1. إذا لم يوجد مستخدم، لا توجد صلاحيات
    if (!user) return { view: false, create: false, update: false, delete: false, pay: false };

    const userType = user.role?.toLowerCase();

    // 2. الحالات التي تمنح صلاحيات كاملة تلقائياً:
    // - إذا كان super_admin أو username هو admin
    // - إذا كان المستخدم ليس Admin (طالب، دكتور، إلخ) لأن صلاحياتهم ثابتة ومحددة بالـ Routes
    if (
      userType === "super_admin" || 
      userType !== "admin"
    ) {
      return { view: true, create: true, update: true, delete: true, pay: true };
    }

    // 3. إذا كان المستخدم Admin (وليس super)، نطبق نظام المجموعات (Groups)
    if (!user.groups) return { view: false, create: false, update: false, delete: false, pay: false };

    const permissions = {
      view: false,
      create: false,
      update: false,
      delete: false,
      pay: false,
    };

    user.groups.forEach((group) => {
      group.permissions?.forEach((perm) => {
        if (typeof perm === "string" && perm.includes(".")) {
          const [permModule, permAction] = perm.split(".");

          if (permModule.toLowerCase() === moduleName?.toLowerCase()) {
            permissions[permAction] = true;
          }
        }
      });
    });

    return permissions;
  }, [user, moduleName]);
};

export default usePermissionsByModule;