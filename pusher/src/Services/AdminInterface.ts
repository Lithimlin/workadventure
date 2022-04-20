import { AdminBannedData, FetchMemberDataByUuidResponse } from "./AdminApi";
import { MapDetailsData } from "../Messages/JsonMessages/MapDetailsData";
import { RoomRedirect } from "../Messages/JsonMessages/RoomRedirect";
import { AdminApiData } from "../Messages/JsonMessages/AdminApiData";

export interface AdminInterface {
    locale: string;

    /**
     * @var playUri: is url of the room
     * @var userIdentifier: can to be undefined or email or uuid
     * @var ipAddress
     * @var characterLayers
     * @return MapDetailsData|RoomRedirect
     */
    fetchMemberDataByUuid(
        userIdentifier: string,
        playUri: string,
        ipAddress: string,
        characterLayers: string[]
    ): Promise<FetchMemberDataByUuidResponse>;

    /**
     * @var playUri: is url of the room
     * @var userId: can to be undefined or email or uuid
     * @return MapDetailsData|RoomRedirect
     */
    fetchMapDetails(playUri: string, authToken?: string): Promise<MapDetailsData | RoomRedirect>;

    /**
     * @param organizationMemberToken
     * @param playUri
     * @return AdminApiData
     */
    fetchMemberDataByToken(organizationMemberToken: string, playUri: string | null): Promise<AdminApiData>;

    /**
     * @param reportedUserUuid
     * @param reportedUserComment
     * @param reporterUserUuid
     * @param reportWorldSlug
     */
    reportPlayer(
        reportedUserUuid: string,
        reportedUserComment: string,
        reporterUserUuid: string,
        reportWorldSlug: string
    ): Promise<unknown>;

    /**
     * @param userUuid
     * @param ipAddress
     * @param roomUrl
     * @return AdminBannedData
     */
    verifyBanUser(userUuid: string, ipAddress: string, roomUrl: string): Promise<AdminBannedData>;

    /**
     * @param roomUrl
     * @return string[]
     */
    getUrlRoomsFromSameWorld(roomUrl: string): Promise<string[]>;

    /**
     * @param accessToken
     * @return string
     */
    getProfileUrl(accessToken: string): string;

    /**
     * @param token
     */
    logoutOauth(token: string): Promise<void>;
}