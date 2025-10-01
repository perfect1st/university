import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify'



export const getAllUsersLookups = createAsyncThunk(
    "/lookupsSlice/getAllUsersLookups",
    async ({query=''}) => {
        try {
            const response = await useGetDataToken(`/users/admins/usersByType?${query}`);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);
export const getAllTripsLookups = createAsyncThunk(
    "/lookupsSlice/getAllTripsLookups",
    async ({query=''}) => {
        try {
            const response = await useGetDataToken(`/trips/admin/getTripsForAdmin?${query}`);
            return response;
        } catch (error) {
            if (error.message == "Network Error")
                return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
            else
            return notify(error.response.data,"error");
        }
    }
);



