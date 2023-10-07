import { Room, RoomResource } from "../models/room";

const toRoom = (roomResource: RoomResource): Room => {
    return {
        id: roomResource.id,
        name: roomResource.name,
        password: roomResource.password,
        ownerId: roomResource.owner_id,
        playerIds: roomResource.player_ids,
    }
}

const toRoomResource = (room: Room): RoomResource => {
    return {
        id: room.id,
        name: room.name,
        password: room.password,
        owner_id: room.ownerId,
        player_ids: room.playerIds,
    }
}

export {
    toRoom,
    toRoomResource,
}