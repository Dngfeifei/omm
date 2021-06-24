import http from './index'

export const GetworkPlatform = () => {
    return http.fetchGet('/workPlatform/basicInfo')
}