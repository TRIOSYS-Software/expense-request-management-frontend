const websocket = (userId) => {
    return new WebSocket(`http://localhost:1234/ws/${userId}`)
}

export default websocket