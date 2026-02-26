import { useSelector } from "react-redux";
import { useMemo } from "react";

const usePermissionsByModule = (moduleName) => {
  const user = useSelector((state) => state.user.loggedUser);

  return useMemo(() => {
    if (!user) return { view: false, create: false, update: false, delete: false };

    // 1. إذا كان super_admin له كل الصلاحيات
    if (user.role === "super_admin" || user.username === "admin") {
      return { view: true, create: true, update: true, delete: true, pay: true };
    }

    if (!user.groups) return { view: false, create: false, update: false, delete: false };

    // 2. البحث في مصفوفة الصلاحيات (التنسيق: "module.action")
    const permissions = {
      view: false,
      create: false,
      update: false,
      delete: false,
      pay: false, // مضافة لأنها موجودة في الـ JSON الخاص بك (usersRequiredFees.pay)
    };

    user.groups.forEach((group) => {
      group.permissions?.forEach((perm) => {
        const [permModule, permAction] = perm.split("."); // "users.view" -> ["users", "view"]

        if (permModule.toLowerCase() === moduleName.toLowerCase()) {
          // تحويل update لـ edit إذا كنت تفضل استخدام edit في الـ UI
          const actionKey = permAction === "update" ? "update" : permAction;
          permissions[actionKey] = true;
        }
      });
    });

    return permissions;
  }, [user, moduleName]);
};

export default usePermissionsByModule;