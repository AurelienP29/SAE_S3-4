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
        zone_id: "PROJJV",
        label: "Zone de projection",
        pathData: "M 715 9 H 836 V 48 H 876 V 94 H 677 V 50 H 716 Z",
        status: "occupied",
        prestataire: {
            id: 102,
            name: "Tournois Jeux Vidéo",
            description: "Espace prévu avec projecteur pour les tournois de jeux vidéo.",
            img: null
        }
    },
    {
        id: 3,
        zone_id: "E2",
        label: "Espace 2",
        pathData: "M 377 92 H 518 V 272 H 448 V 302 H 377 Z",
        status: "pending",
        prestataire: {
            id: 102,
            name: "Jean PHILLIBERT les menuisiers",
            description: "Oh la la comment je suis tout sympa tout plein en tant que test",
            img: null
        }
    },
    {
        id: 4,
        zone_id: "A3",
        label: "Animation 3",
        pathData: "M 253 105 H 326 V 176 H 253 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 5,
        zone_id: "S4",
        label: "Stand 4",
        pathData: "M 304 65 H 340 V 106 H 304 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 6,
        zone_id: "A5",
        label: "Animation 5",
        pathData: "M 378 8 H 455 V 47 H 378 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 7,
        zone_id: "S6",
        label: "Stand 6",
        pathData: "M 456 8 H 491 V 36 H 456 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 8,
        zone_id: "S7",
        label: "Stand 7",
        pathData: "M 492 8 H 528 V 36 H 492 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 9,
        zone_id: "S8",
        label: "Stand 8",
        pathData: "M 529 8 H 564 V 36 H 529 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 10,
        zone_id: "S9",
        label: "Stand 9",
        pathData: "M 566 9 H 602 V 36 H 566 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 11,
        zone_id: "A10",
        label: "Animation 10",
        pathData: "M 678 7 H 714 V 48 H 678 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 12,
        zone_id: "A11",
        label: "Animation 11",
        pathData: "M 837 7 H 877 V 49 H 837 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 13,
        zone_id: "S12",
        label: "Stand 12",
        pathData: "M 567 92 H 603 V 135 H 567 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 14,
        zone_id: "A13",
        label: "Animation 13",
        pathData: "M 566 135 H 602 V 215 H 566 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 15,
        zone_id: "S14",
        label: "Stand 14",
        pathData: "M 567 217 H 602 V 258 H 567 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 16,
        zone_id: "S15",
        label: "Stand 15",
        pathData: "M 566 259 H 628 V 302 H 566 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 17,
        zone_id: "S16",
        label: "Stand 16",
        pathData: "M 604 92 H 627 V 176 H 604 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 18,
        zone_id: "S17",
        label: "Stand 17",
        pathData: "M 604 177 H 626 V 216 H 604 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 19,
        zone_id: "S18",
        label: "Stand 18",
        pathData: "M 604 217 H 627 V 258 H 604 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 20,
        zone_id: "S19",
        label: "Stand 19",
        pathData: "M 665 134 H 689 V 217 H 665 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 21,
        zone_id: "S20",
        label: "Stand 20",
        pathData: "M 665 217 H 688 V 301 H 665 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 22,
        zone_id: "S21",
        label: "Stand 21",
        pathData: "M 691 134 H 713 V 175 H 691 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 23,
        zone_id: "S22",
        label: "Stand 22",
        pathData: "M 690 175 H 713 V 217 H 690 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 24,
        zone_id: "S23",
        label: "Stand 23",
        pathData: "M 690 218 H 714 V 302 H 690 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 25,
        zone_id: "S24",
        label: "Stand 24",
        pathData: "M 751 134 H 826 V 176 H 751 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 26,
        zone_id: "A25",
        label: "Animation 25",
        pathData: "M 752 177 H 788 V 259 H 752 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 27,
        zone_id: "S26",
        label: "Stand 26",
        pathData: "M 751 260 H 826 V 303 H 751 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 28,
        zone_id: "BAR",
        label: "Bar",
        pathData: "M 996 359 H 1068 V 468 H 996 Z",
        status: "occupied",
        prestataire: {
            id: 128,
            name: "Bar a bubble tea",
            description: "Boisson disponible pour tout le monde, plusieurs choix possible.",
            img: null
        }
    },
    {
        id: 29,
        zone_id: "S28",
        label: "Stand 28",
        pathData: "M 863 133 H 900 V 259 H 863 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 30,
        zone_id: "S29",
        label: "Stand 29",
        pathData: "M 863 259 H 900 V 302 H 863 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 31,
        zone_id: "A30",
        label: "Animation 30",
        pathData: "M 902 134 H 926 V 176 H 902 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 32,
        zone_id: "A31",
        label: "Animation 31",
        pathData: "M 902 177 H 926 V 301 H 902 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 33,
        zone_id: "S32",
        label: "Stand 32",
        pathData: "M 365 343 H 405 V 372 H 365 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 34,
        zone_id: "S33",
        label: "Stand 33",
        pathData: "M 406 344 H 442 V 371 H 406 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 35,
        zone_id: "S34",
        label: "Stand 34",
        pathData: "M 443 343 H 479 V 371 H 443 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 36,
        zone_id: "S35",
        label: "Stand 35",
        pathData: "M 480 343 H 553 V 372 H 480 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 37,
        zone_id: "S36",
        label: "Stand 36",
        pathData: "M 554 343 H 590 V 371 H 554 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 38,
        zone_id: "S37",
        label: "Stand 37",
        pathData: "M 591 343 H 627 V 371 H 591 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 39,
        zone_id: "S38",
        label: "Stand 38",
        pathData: "M 665 343 H 776 V 372 H 665 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 40,
        zone_id: "S39",
        label: "Stand 39",
        pathData: "M 777 344 H 813 V 371 H 777 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 41,
        zone_id: "S40",
        label: "Stand 40",
        pathData: "M 814 344 H 849 V 371 H 814 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 42,
        zone_id: "S41",
        label: "Stand 41",
        pathData: "M 851 344 H 887 V 371 H 851 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 43,
        zone_id: "S42",
        label: "Stand 42",
        pathData: "M 888 343 H 924 V 372 H 888 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 44,
        zone_id: "S43",
        label: "Stand 43",
        pathData: "M 365 372 H 552 V 400 H 365 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 45,
        zone_id: "S44",
        label: "Stand 44",
        pathData: "M 554 372 H 591 V 399 H 554 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 46,
        zone_id: "S45",
        label: "Stand 45",
        pathData: "M 591 372 H 626 V 399 H 591 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 47,
        zone_id: "S46",
        label: "Stand 46",
        pathData: "M 666 372 H 702 V 400 H 666 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 48,
        zone_id: "S47",
        label: "Stand 47",
        pathData: "M 703 372 H 925 V 400 H 703 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 49,
        zone_id: "S48",
        label: "Stand 48",
        pathData: "M 365 456 H 405 V 483 H 365 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 50,
        zone_id: "S49",
        label: "Stand 49",
        pathData: "M 406 455 H 442 V 483 H 406 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 51,
        zone_id: "S50",
        label: "Stand 50",
        pathData: "M 443 456 H 479 V 483 H 443 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 52,
        zone_id: "S51",
        label: "Stand 51",
        pathData: "M 480 455 H 516 V 483 H 480 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 53,
        zone_id: "S52",
        label: "Stand 52",
        pathData: "M 517 455 H 553 V 483 H 517 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 54,
        zone_id: "S53",
        label: "Stand 53",
        pathData: "M 555 455 H 590 V 484 H 555 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 55,
        zone_id: "S54",
        label: "Stand 54",
        pathData: "M 591 455 H 627 V 483 H 591 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 56,
        zone_id: "S55",
        label: "Stand 55",
        pathData: "M 365 484 H 405 V 513 H 365 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 57,
        zone_id: "S56",
        label: "Stand 56",
        pathData: "M 406 485 H 442 V 514 H 406 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 58,
        zone_id: "S57",
        label: "Stand 57",
        pathData: "M 443 485 H 479 V 512 H 443 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 59,
        zone_id: "S58",
        label: "Stand 58",
        pathData: "M 481 485 H 515 V 512 H 480 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 60,
        zone_id: "S59",
        label: "Stand 59",
        pathData: "M 517 484 H 553 V 513 H 517 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 61,
        zone_id: "S60",
        label: "Stand 60",
        pathData: "M 554 484 H 590 V 512 H 554 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 62,
        zone_id: "S61",
        label: "Stand 61",
        pathData: "M 592 485 H 628 V 512 H 591 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 63,
        zone_id: "S62",
        label: "Stand 62",
        pathData: "M 666 455 H 739 V 538 H 665 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 64,
        zone_id: "S63",
        label: "Stand 63",
        pathData: "M 666 540 H 702 V 567 H 666 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 65,
        zone_id: "S64",
        label: "Stand 64",
        pathData: "M 703 540 H 738 V 567 H 703 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 66,
        zone_id: "S65",
        label: "Stand 65",
        pathData: "M 777 458 H 814 V 540 H 777 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 67,
        zone_id: "S66",
        label: "Stand 66",
        pathData: "M 777 542 H 850 V 569 H 777 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 68,
        zone_id: "S67",
        label: "Stand 67",
        pathData: "M 814 458 H 849 V 499 H 815 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 69,
        zone_id: "S68",
        label: "Stand 68",
        pathData: "M 814 501 H 851 V 539 H 815 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 70,
        zone_id: "R69",
        label: "Restoration 69",
        pathData: "M 585 660 H 626 V 691 H 585 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 71,
        zone_id: "S70",
        label: "Stand 70",
        pathData: "M 698 665 H 805 V 692 H 698 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 72,
        zone_id: "R71",
        label: "Restoration 71",
        pathData: "M 1076 555 H 1116 V 629 H 1075 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 73,
        zone_id: "S72",
        label: "Stand 72",
        pathData: "M 698 742 H 805 V 779 H 698 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 74,
        zone_id: "S73",
        label: "Stand 73",
        pathData: "M 861 742 H 894 V 768 H 861 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 75,
        zone_id: "S74",
        label: "Stand 74",
        pathData: "M 896 743 H 929 V 767 H 896 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 76,
        zone_id: "S75",
        label: "Stand 75",
        pathData: "M 930 742 H 965 V 767 H 931 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 77,
        zone_id: "S76",
        label: "Stand 76",
        pathData: "M 652 904 H 684 V 929 H 653 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 78,
        zone_id: "S77",
        label: "Stand 77",
        pathData: "M 685 905 H 716 V 929 H 686 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 79,
        zone_id: "S78",
        label: "Stand 78",
        pathData: "M 719 905 H 750 V 928 H 719 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 80,
        zone_id: "S79",
        label: "Stand 79",
        pathData: "M 751 905 H 782 V 928 H 751 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 81,
        zone_id: "S80",
        label: "Stand 80",
        pathData: "M 784 905 H 815 V 928 H 784 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 82,
        zone_id: "A81",
        label: "Animation 81",
        pathData: "M 258 497 H 319 V 540 H 258 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 83,
        zone_id: "E82",
        label: "Espace 82",
        pathData: "M 890 457 H 960 V 580 H 890 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 84,
        zone_id: "A83",
        label: "Animation 83",
        pathData: "M 1007 649 H 1116 V 692 H 1007 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 85,
        zone_id: "E84",
        label: "Espace 84",
        pathData: "M 839 804 H 991 V 928 H 839 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 86,
        zone_id: "A85",
        label: "Animation 85",
        pathData: "M 729 815 H 809 V 867 H 729 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 87,
        zone_id: "A86",
        label: "Animation 86",
        pathData: "M 616 815 H 720 V 867 H 616 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 88,
        zone_id: "A87",
        label: "Animation 87",
        pathData: "M 544 867 H 586 V 929 H 544 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 89,
        zone_id: "E88",
        label: "Espace 88",
        pathData: "M 543 743 H 587 V 848 H 544 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 90,
        zone_id: "A89",
        label: "Animation 89",
        pathData: "M 449 273 H 518 V 301 H 449 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 91,
        zone_id: "A90",
        label: "Animation 90",
        pathData: "M 890 580 H 960 V 609 H 890 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 92,
        zone_id: "S91",
        label: "Stand 91",
        pathData: "M 619 904 H 650 V 928 H 619 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 93,
        zone_id: "A92",
        label: "Animation 92",
        pathData: "M 890 649 H 926 V 691 H 890 Z",
        status: "free",
        prestataire: null
    },
    {
        id: 94,
        zone_id: "S93",
        label: "Stand 93",
        pathData: "M 927 649 H 961 V 691 H 927 Z",
        status: "free",
        prestataire: null
    }
]