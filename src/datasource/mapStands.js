export const mapStands = [
    {
        id: 1,
        zone_id: "Scene",
        label: "Scene",
        pathData: "M 972 22 H 1100 V 120 H 1062 V 162 H 1012 V 119 H 972 Z",
        status: "occupied", // 'free', 'pending', 'occupied'
        prestataire: {
            id: 101,
            name: "Scene principale",
            description: "Évènements en tout genre.",
            img: null
        }
    },
    {
        id: 2,
        zone_id: "S43",
        label: "Stand 43",
        pathData: "M 365 371 H 553 V 401 H 364 Z",
        status: "pending",
        prestataire: {
            id: 101,
            name: "Jean PHILLIBERT les menuisiers",
            description: "Oh la la comment je suis tout sympa tout plein en tant que test",
            img: null
        }
    },
    {
        id: 3,
        zone_id: "S82",
        label: "Stand 82",
        pathData: "M 889 457 H 960 V 579 H 889 Z",
        status: "free",
        prestataire: null
    }
]