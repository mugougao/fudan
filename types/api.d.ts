export {};

declare global {
  interface ApiResponseType {
    success: boolean;
    code: number;
    message: string;
  }

  interface ApiResponseDataType<T> extends ApiResponseType {
    resultData: T;
  }

  interface ApiResponsePageInfoType<T> extends ApiResponseType {
    resultData: {
      pageNum: number;
      pageSize: number;
      size: number;
      startRow: number;
      endRow: number;
      total: number;
      pages: number;
      list: T[];
      prePage: number;
      nextPage: number;
      isFirstPage: boolean;
      isLastPage: boolean;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      navigatePages: number;
      navigatepageNums: number[];
      navigateFirstPage: number;
      navigateLastPage: number;
      firstPage: number;
      lastPage: number;
    };
  }
}
