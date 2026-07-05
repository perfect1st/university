import { useSelector } from "react-redux";
  import { useMemo } from "react";
  import routesData from "../data/routes";
  import { useQuery } from "@apollo/client/react";
  import { GET_ALL_TRANSACTION_TYPES } from "../graphql/transactionTypeQueries";
  import logger from "../utils/logger";

  const useAccessibleRoutes = () => {
    const user = useSelector((state) => state.user.loggedUser);

    logger.log("loggedUserloggedUser",user)
  const filteredRoutes = useMemo(() => {
      if (!user) return [];

      const userType = user.role?.toLowerCase();
      const routes = routesData[userType] || [];

      if (userType !== "admin") {
        return routes;
      }

      if (!user.groups) return [];

      const allowedModules = new Set();
      user.groups.forEach(group => {
        group.permissions?.forEach(perm => {
          if (typeof perm === "string" && perm.endsWith(".view")) {
            const moduleName = perm.split(".")[0];
            allowedModules.add(moduleName.toLowerCase());
          }
        });
      });

      const alwaysAllowed = ["profile", "dashboard", "studentdashboard"];

      const isRouteAllowed = (route) => {
        if (route.isPublic) return true;
        const key = route.key?.toLowerCase();
        return allowedModules.has(key) || alwaysAllowed.includes(key);
      };

      return routes
        .map(route => {
          if (route.children) {
            const filteredChildren = route.children.filter(child => isRouteAllowed(child));
            return filteredChildren.length > 0 ? { ...route, children: filteredChildren } : null;
          }
          return isRouteAllowed(route) ? route : null;
        })
        .filter(Boolean);

    }, [user]);

    const { data: transTypesData } = useQuery(GET_ALL_TRANSACTION_TYPES, {
      skip: user?.role?.toLowerCase() !== "admin",
    });

    const finalRoutes = useMemo(() => {
      if (user?.role?.toLowerCase() !== "admin" || !transTypesData?.getTransactionTypes) {
        return filteredRoutes;
      }

      const filteredTypes = transTypesData.getTransactionTypes.filter(
        (type) => type.status === true,
      );

      if (filteredTypes.length === 0) return filteredRoutes;

      const dynamicTypeRoutes = filteredTypes.map((type) => ({
        key: `type-${type.id}`,
        label: {
          ar: type.title_ar,
          en: type.title_en,
        },
        path: `/transactions?transaction_type_id=${type.id}&operation_type=${type.operation_type}`,
      }));

      const financialGroupIndex = filteredRoutes.findIndex(
        (route) => route.key === "group_financial",
      );

      if (financialGroupIndex === -1) {
        return [...filteredRoutes, ...dynamicTypeRoutes];
      }

      const financialGroup = filteredRoutes[financialGroupIndex];
      const children = financialGroup.children || [];

      const transactionsChildIndex = children.findIndex(
        (child) => child.key?.toLowerCase() === "transactions",
      );

      const updatedChildren = [...children];
      if (transactionsChildIndex !== -1) {
        updatedChildren.splice(transactionsChildIndex, 0, ...dynamicTypeRoutes);
      } else {
        updatedChildren.push(...dynamicTypeRoutes);
      }

      const updatedFinancialGroup = { ...financialGroup, children: updatedChildren };

      const result = [...filteredRoutes];
      result[financialGroupIndex] = updatedFinancialGroup;
      return result;
    }, [filteredRoutes, transTypesData, user]);

    return finalRoutes;
  };

  export default useAccessibleRoutes;