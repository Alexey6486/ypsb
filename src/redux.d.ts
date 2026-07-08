import { AsyncThunkAction } from '@reduxjs/toolkit';

declare module '@reduxjs/toolkit' {
  interface AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig> {
    unwrap(): Promise<Returned>;
  }
}
