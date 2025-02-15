import { AxiosResponse } from "axios";

export const isSuccessfullStatus = (response: AxiosResponse): boolean => {
  return (
    Boolean(response.status) && response.status >= 200 && response.status < 300
  );
};
