// 포켓몬 전체 도감 데이터 (1세대 ~ 9세대, 총 1025종 공식 한국어 데이터)
const POKEMON_DATABASE = [
  {
    "id": 1,
    "name": "이상해씨",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      2
    ]
  },
  {
    "id": 2,
    "name": "이상해풀",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      3
    ]
  },
  {
    "id": 3,
    "name": "이상해꽃",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 4,
    "name": "파이리",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      5
    ]
  },
  {
    "id": 5,
    "name": "리자드",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      6
    ]
  },
  {
    "id": 6,
    "name": "리자몽",
    "type": [
      "불꽃",
      "비행"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 7,
    "name": "꼬부기",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      8
    ]
  },
  {
    "id": 8,
    "name": "어니부기",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      9
    ]
  },
  {
    "id": 9,
    "name": "거북왕",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 10,
    "name": "캐터피",
    "type": [
      "벌레"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      11
    ]
  },
  {
    "id": 11,
    "name": "단데기",
    "type": [
      "벌레"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      12
    ]
  },
  {
    "id": 12,
    "name": "버터플",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 13,
    "name": "뿔충이",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      14
    ]
  },
  {
    "id": 14,
    "name": "딱충이",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      15
    ]
  },
  {
    "id": 15,
    "name": "독침붕",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 16,
    "name": "구구",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      17
    ]
  },
  {
    "id": 17,
    "name": "피죤",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      18
    ]
  },
  {
    "id": 18,
    "name": "피죤투",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 19,
    "name": "꼬렛",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      20
    ]
  },
  {
    "id": 20,
    "name": "레트라",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 21,
    "name": "깨비참",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      22
    ]
  },
  {
    "id": 22,
    "name": "깨비드릴조",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 23,
    "name": "아보",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      24
    ]
  },
  {
    "id": 24,
    "name": "아보크",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 25,
    "name": "피카츄",
    "type": [
      "전기"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      26
    ]
  },
  {
    "id": 26,
    "name": "라이츄",
    "type": [
      "전기"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 27,
    "name": "모래두지",
    "type": [
      "땅"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      28
    ]
  },
  {
    "id": 28,
    "name": "고지",
    "type": [
      "땅"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 29,
    "name": "니드런♀",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      30
    ]
  },
  {
    "id": 30,
    "name": "니드리나",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      31
    ]
  },
  {
    "id": 31,
    "name": "니드퀸",
    "type": [
      "독",
      "땅"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 32,
    "name": "니드런♂",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      33
    ]
  },
  {
    "id": 33,
    "name": "니드리노",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      34
    ]
  },
  {
    "id": 34,
    "name": "니드킹",
    "type": [
      "독",
      "땅"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 35,
    "name": "삐삐",
    "type": [
      "페어리"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      36
    ]
  },
  {
    "id": 36,
    "name": "픽시",
    "type": [
      "페어리"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 37,
    "name": "식스테일",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      38
    ]
  },
  {
    "id": 38,
    "name": "나인테일",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 39,
    "name": "푸린",
    "type": [
      "노말",
      "페어리"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      40
    ]
  },
  {
    "id": 40,
    "name": "푸크린",
    "type": [
      "노말",
      "페어리"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 41,
    "name": "주뱃",
    "type": [
      "독",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      42
    ]
  },
  {
    "id": 42,
    "name": "골뱃",
    "type": [
      "독",
      "비행"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      169
    ]
  },
  {
    "id": 43,
    "name": "뚜벅쵸",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      44
    ]
  },
  {
    "id": 44,
    "name": "냄새꼬",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      45,
      182
    ]
  },
  {
    "id": 45,
    "name": "라플레시아",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 46,
    "name": "파라스",
    "type": [
      "벌레",
      "풀"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      47
    ]
  },
  {
    "id": 47,
    "name": "파라섹트",
    "type": [
      "벌레",
      "풀"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 48,
    "name": "콘팡",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      49
    ]
  },
  {
    "id": 49,
    "name": "도나리",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 50,
    "name": "디그다",
    "type": [
      "땅"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      51
    ]
  },
  {
    "id": 51,
    "name": "닥트리오",
    "type": [
      "땅"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 52,
    "name": "나옹",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      53,
      863
    ]
  },
  {
    "id": 53,
    "name": "페르시온",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 54,
    "name": "고라파덕",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      55
    ]
  },
  {
    "id": 55,
    "name": "골덕",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 56,
    "name": "망키",
    "type": [
      "격투"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      57
    ]
  },
  {
    "id": 57,
    "name": "성원숭",
    "type": [
      "격투"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      979
    ]
  },
  {
    "id": 58,
    "name": "가디",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      59
    ]
  },
  {
    "id": 59,
    "name": "윈디",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 60,
    "name": "발챙이",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      61
    ]
  },
  {
    "id": 61,
    "name": "슈륙챙이",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      62,
      186
    ]
  },
  {
    "id": 62,
    "name": "강챙이",
    "type": [
      "물",
      "격투"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 63,
    "name": "캐이시",
    "type": [
      "에스퍼"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      64
    ]
  },
  {
    "id": 64,
    "name": "윤겔라",
    "type": [
      "에스퍼"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      65
    ]
  },
  {
    "id": 65,
    "name": "후딘",
    "type": [
      "에스퍼"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 66,
    "name": "알통몬",
    "type": [
      "격투"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      67
    ]
  },
  {
    "id": 67,
    "name": "근육몬",
    "type": [
      "격투"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      68
    ]
  },
  {
    "id": 68,
    "name": "괴력몬",
    "type": [
      "격투"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 69,
    "name": "모다피",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      70
    ]
  },
  {
    "id": 70,
    "name": "우츠동",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      71
    ]
  },
  {
    "id": 71,
    "name": "우츠보트",
    "type": [
      "풀",
      "독"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 72,
    "name": "왕눈해",
    "type": [
      "물",
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      73
    ]
  },
  {
    "id": 73,
    "name": "독파리",
    "type": [
      "물",
      "독"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 74,
    "name": "꼬마돌",
    "type": [
      "바위",
      "땅"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      75
    ]
  },
  {
    "id": 75,
    "name": "데구리",
    "type": [
      "바위",
      "땅"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      76
    ]
  },
  {
    "id": 76,
    "name": "딱구리",
    "type": [
      "바위",
      "땅"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 77,
    "name": "포니타",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      78
    ]
  },
  {
    "id": 78,
    "name": "날쌩마",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 79,
    "name": "야돈",
    "type": [
      "물",
      "에스퍼"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      80,
      199
    ]
  },
  {
    "id": 80,
    "name": "야도란",
    "type": [
      "물",
      "에스퍼"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 81,
    "name": "코일",
    "type": [
      "전기",
      "강철"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      82
    ]
  },
  {
    "id": 82,
    "name": "레어코일",
    "type": [
      "전기",
      "강철"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      462
    ]
  },
  {
    "id": 83,
    "name": "파오리",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      865
    ]
  },
  {
    "id": 84,
    "name": "두두",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      85
    ]
  },
  {
    "id": 85,
    "name": "두트리오",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 86,
    "name": "쥬쥬",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      87
    ]
  },
  {
    "id": 87,
    "name": "쥬레곤",
    "type": [
      "물",
      "얼음"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 88,
    "name": "질퍽이",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      89
    ]
  },
  {
    "id": 89,
    "name": "질뻐기",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 90,
    "name": "셀러",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      91
    ]
  },
  {
    "id": 91,
    "name": "파르셀",
    "type": [
      "물",
      "얼음"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 92,
    "name": "고오스",
    "type": [
      "고스트",
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      93
    ]
  },
  {
    "id": 93,
    "name": "고우스트",
    "type": [
      "고스트",
      "독"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      94
    ]
  },
  {
    "id": 94,
    "name": "팬텀",
    "type": [
      "고스트",
      "독"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 95,
    "name": "롱스톤",
    "type": [
      "바위",
      "땅"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      208
    ]
  },
  {
    "id": 96,
    "name": "슬리프",
    "type": [
      "에스퍼"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      97
    ]
  },
  {
    "id": 97,
    "name": "슬리퍼",
    "type": [
      "에스퍼"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 98,
    "name": "크랩",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      99
    ]
  },
  {
    "id": 99,
    "name": "킹크랩",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 100,
    "name": "찌리리공",
    "type": [
      "전기"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      101
    ]
  },
  {
    "id": 101,
    "name": "붐볼",
    "type": [
      "전기"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 102,
    "name": "아라리",
    "type": [
      "풀",
      "에스퍼"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      103
    ]
  },
  {
    "id": 103,
    "name": "나시",
    "type": [
      "풀",
      "에스퍼"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 104,
    "name": "탕구리",
    "type": [
      "땅"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      105
    ]
  },
  {
    "id": 105,
    "name": "텅구리",
    "type": [
      "땅"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 106,
    "name": "시라소몬",
    "type": [
      "격투"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 107,
    "name": "홍수몬",
    "type": [
      "격투"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 108,
    "name": "내루미",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      463
    ]
  },
  {
    "id": 109,
    "name": "또가스",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      110
    ]
  },
  {
    "id": 110,
    "name": "또도가스",
    "type": [
      "독"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 111,
    "name": "뿔카노",
    "type": [
      "땅",
      "바위"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      112
    ]
  },
  {
    "id": 112,
    "name": "코뿌리",
    "type": [
      "땅",
      "바위"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      464
    ]
  },
  {
    "id": 113,
    "name": "럭키",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      242
    ]
  },
  {
    "id": 114,
    "name": "덩쿠리",
    "type": [
      "풀"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      465
    ]
  },
  {
    "id": 115,
    "name": "캥카",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1
  },
  {
    "id": 116,
    "name": "쏘드라",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      117
    ]
  },
  {
    "id": 117,
    "name": "시드라",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      230
    ]
  },
  {
    "id": 118,
    "name": "콘치",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      119
    ]
  },
  {
    "id": 119,
    "name": "왕콘치",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 120,
    "name": "별가사리",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      121
    ]
  },
  {
    "id": 121,
    "name": "아쿠스타",
    "type": [
      "물",
      "에스퍼"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 122,
    "name": "마임맨",
    "type": [
      "에스퍼",
      "페어리"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      866
    ]
  },
  {
    "id": 123,
    "name": "스라크",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      212,
      900
    ]
  },
  {
    "id": 124,
    "name": "루주라",
    "type": [
      "얼음",
      "에스퍼"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 125,
    "name": "에레브",
    "type": [
      "전기"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      466
    ]
  },
  {
    "id": 126,
    "name": "마그마",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      467
    ]
  },
  {
    "id": 127,
    "name": "쁘사이저",
    "type": [
      "벌레"
    ],
    "gen": 1,
    "stage": 1
  },
  {
    "id": 128,
    "name": "켄타로스",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1
  },
  {
    "id": 129,
    "name": "잉어킹",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      130
    ]
  },
  {
    "id": 130,
    "name": "갸라도스",
    "type": [
      "물",
      "비행"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 131,
    "name": "라프라스",
    "type": [
      "물",
      "얼음"
    ],
    "gen": 1,
    "stage": 1
  },
  {
    "id": 132,
    "name": "메타몽",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1
  },
  {
    "id": 133,
    "name": "이브이",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      134,
      135,
      136,
      196,
      197,
      470,
      471,
      700
    ]
  },
  {
    "id": 134,
    "name": "샤미드",
    "type": [
      "물"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 135,
    "name": "쥬피썬더",
    "type": [
      "전기"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 136,
    "name": "부스터",
    "type": [
      "불꽃"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 137,
    "name": "폴리곤",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      233
    ]
  },
  {
    "id": 138,
    "name": "암나이트",
    "type": [
      "바위",
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      139
    ]
  },
  {
    "id": 139,
    "name": "암스타",
    "type": [
      "바위",
      "물"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 140,
    "name": "투구",
    "type": [
      "바위",
      "물"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      141
    ]
  },
  {
    "id": 141,
    "name": "투구푸스",
    "type": [
      "바위",
      "물"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 142,
    "name": "프테라",
    "type": [
      "바위",
      "비행"
    ],
    "gen": 1,
    "stage": 1
  },
  {
    "id": 143,
    "name": "잠만보",
    "type": [
      "노말"
    ],
    "gen": 1,
    "stage": 2
  },
  {
    "id": 144,
    "name": "프리져",
    "type": [
      "얼음",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "legend": true
  },
  {
    "id": 145,
    "name": "썬더",
    "type": [
      "전기",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "legend": true
  },
  {
    "id": 146,
    "name": "파이어",
    "type": [
      "불꽃",
      "비행"
    ],
    "gen": 1,
    "stage": 1,
    "legend": true
  },
  {
    "id": 147,
    "name": "미뇽",
    "type": [
      "드래곤"
    ],
    "gen": 1,
    "stage": 1,
    "evolvesTo": [
      148
    ]
  },
  {
    "id": 148,
    "name": "신뇽",
    "type": [
      "드래곤"
    ],
    "gen": 1,
    "stage": 2,
    "evolvesTo": [
      149
    ]
  },
  {
    "id": 149,
    "name": "망나뇽",
    "type": [
      "드래곤",
      "비행"
    ],
    "gen": 1,
    "stage": 3
  },
  {
    "id": 150,
    "name": "뮤츠",
    "type": [
      "에스퍼"
    ],
    "gen": 1,
    "stage": 1,
    "legend": true
  },
  {
    "id": 151,
    "name": "뮤",
    "type": [
      "에스퍼"
    ],
    "gen": 1,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 152,
    "name": "치코리타",
    "type": [
      "풀"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      153
    ]
  },
  {
    "id": 153,
    "name": "베이리프",
    "type": [
      "풀"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      154
    ]
  },
  {
    "id": 154,
    "name": "메가니움",
    "type": [
      "풀"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 155,
    "name": "브케인",
    "type": [
      "불꽃"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      156
    ]
  },
  {
    "id": 156,
    "name": "마그케인",
    "type": [
      "불꽃"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      157
    ]
  },
  {
    "id": 157,
    "name": "블레이범",
    "type": [
      "불꽃"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 158,
    "name": "리아코",
    "type": [
      "물"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      159
    ]
  },
  {
    "id": 159,
    "name": "엘리게이",
    "type": [
      "물"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      160
    ]
  },
  {
    "id": 160,
    "name": "장크로다일",
    "type": [
      "물"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 161,
    "name": "꼬리선",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      162
    ]
  },
  {
    "id": 162,
    "name": "다꼬리",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 163,
    "name": "부우부",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      164
    ]
  },
  {
    "id": 164,
    "name": "야부엉",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 165,
    "name": "레디바",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      166
    ]
  },
  {
    "id": 166,
    "name": "레디안",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 167,
    "name": "페이검",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      168
    ]
  },
  {
    "id": 168,
    "name": "아리아도스",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 169,
    "name": "크로뱃",
    "type": [
      "독",
      "비행"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 170,
    "name": "초라기",
    "type": [
      "물",
      "전기"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      171
    ]
  },
  {
    "id": 171,
    "name": "랜턴",
    "type": [
      "물",
      "전기"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 172,
    "name": "피츄",
    "type": [
      "전기"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      25
    ]
  },
  {
    "id": 173,
    "name": "삐",
    "type": [
      "페어리"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      35
    ]
  },
  {
    "id": 174,
    "name": "푸푸린",
    "type": [
      "노말",
      "페어리"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      39
    ]
  },
  {
    "id": 175,
    "name": "토게피",
    "type": [
      "페어리"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      176
    ]
  },
  {
    "id": 176,
    "name": "토게틱",
    "type": [
      "페어리",
      "비행"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      468
    ]
  },
  {
    "id": 177,
    "name": "네이티",
    "type": [
      "에스퍼",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      178
    ]
  },
  {
    "id": 178,
    "name": "네이티오",
    "type": [
      "에스퍼",
      "비행"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 179,
    "name": "메리프",
    "type": [
      "전기"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      180
    ]
  },
  {
    "id": 180,
    "name": "보송송",
    "type": [
      "전기"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      181
    ]
  },
  {
    "id": 181,
    "name": "전룡",
    "type": [
      "전기"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 182,
    "name": "아르코",
    "type": [
      "풀"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 183,
    "name": "마릴",
    "type": [
      "물",
      "페어리"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      184
    ]
  },
  {
    "id": 184,
    "name": "마릴리",
    "type": [
      "물",
      "페어리"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 185,
    "name": "꼬지모",
    "type": [
      "바위"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 186,
    "name": "왕구리",
    "type": [
      "물"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 187,
    "name": "통통코",
    "type": [
      "풀",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      188
    ]
  },
  {
    "id": 188,
    "name": "두코",
    "type": [
      "풀",
      "비행"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      189
    ]
  },
  {
    "id": 189,
    "name": "솜솜코",
    "type": [
      "풀",
      "비행"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 190,
    "name": "에이팜",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      424
    ]
  },
  {
    "id": 191,
    "name": "해너츠",
    "type": [
      "풀"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      192
    ]
  },
  {
    "id": 192,
    "name": "해루미",
    "type": [
      "풀"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 193,
    "name": "왕자리",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      469
    ]
  },
  {
    "id": 194,
    "name": "우파",
    "type": [
      "물",
      "땅"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      195,
      980
    ]
  },
  {
    "id": 195,
    "name": "누오",
    "type": [
      "물",
      "땅"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 196,
    "name": "에브이",
    "type": [
      "에스퍼"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 197,
    "name": "블래키",
    "type": [
      "악"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 198,
    "name": "니로우",
    "type": [
      "악",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      430
    ]
  },
  {
    "id": 199,
    "name": "야도킹",
    "type": [
      "물",
      "에스퍼"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 200,
    "name": "무우마",
    "type": [
      "고스트"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      429
    ]
  },
  {
    "id": 201,
    "name": "안농",
    "type": [
      "에스퍼"
    ],
    "gen": 2,
    "stage": 1
  },
  {
    "id": 202,
    "name": "마자용",
    "type": [
      "에스퍼"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 203,
    "name": "키링키",
    "type": [
      "노말",
      "에스퍼"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      981
    ]
  },
  {
    "id": 204,
    "name": "피콘",
    "type": [
      "벌레"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      205
    ]
  },
  {
    "id": 205,
    "name": "쏘콘",
    "type": [
      "벌레",
      "강철"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 206,
    "name": "노고치",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      982
    ]
  },
  {
    "id": 207,
    "name": "글라이거",
    "type": [
      "땅",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      472
    ]
  },
  {
    "id": 208,
    "name": "강철톤",
    "type": [
      "강철",
      "땅"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 209,
    "name": "블루",
    "type": [
      "페어리"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      210
    ]
  },
  {
    "id": 210,
    "name": "그랑블루",
    "type": [
      "페어리"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 211,
    "name": "침바루",
    "type": [
      "물",
      "독"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      904
    ]
  },
  {
    "id": 212,
    "name": "핫삼",
    "type": [
      "벌레",
      "강철"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 213,
    "name": "단단지",
    "type": [
      "벌레",
      "바위"
    ],
    "gen": 2,
    "stage": 1
  },
  {
    "id": 214,
    "name": "헤라크로스",
    "type": [
      "벌레",
      "격투"
    ],
    "gen": 2,
    "stage": 1
  },
  {
    "id": 215,
    "name": "포푸니",
    "type": [
      "악",
      "얼음"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      461,
      903
    ]
  },
  {
    "id": 216,
    "name": "깜지곰",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      217
    ]
  },
  {
    "id": 217,
    "name": "링곰",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      901
    ]
  },
  {
    "id": 218,
    "name": "마그마그",
    "type": [
      "불꽃"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      219
    ]
  },
  {
    "id": 219,
    "name": "마그카르고",
    "type": [
      "불꽃",
      "바위"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 220,
    "name": "꾸꾸리",
    "type": [
      "얼음",
      "땅"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      221
    ]
  },
  {
    "id": 221,
    "name": "메꾸리",
    "type": [
      "얼음",
      "땅"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      473
    ]
  },
  {
    "id": 222,
    "name": "코산호",
    "type": [
      "물",
      "바위"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      864
    ]
  },
  {
    "id": 223,
    "name": "총어",
    "type": [
      "물"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      224
    ]
  },
  {
    "id": 224,
    "name": "대포무노",
    "type": [
      "물"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 225,
    "name": "딜리버드",
    "type": [
      "얼음",
      "비행"
    ],
    "gen": 2,
    "stage": 1
  },
  {
    "id": 226,
    "name": "만타인",
    "type": [
      "물",
      "비행"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 227,
    "name": "무장조",
    "type": [
      "강철",
      "비행"
    ],
    "gen": 2,
    "stage": 1
  },
  {
    "id": 228,
    "name": "델빌",
    "type": [
      "악",
      "불꽃"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      229
    ]
  },
  {
    "id": 229,
    "name": "헬가",
    "type": [
      "악",
      "불꽃"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 230,
    "name": "킹드라",
    "type": [
      "물",
      "드래곤"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 231,
    "name": "코코리",
    "type": [
      "땅"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      232
    ]
  },
  {
    "id": 232,
    "name": "코리갑",
    "type": [
      "땅"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 233,
    "name": "폴리곤2",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      474
    ]
  },
  {
    "id": 234,
    "name": "노라키",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      899
    ]
  },
  {
    "id": 235,
    "name": "루브도",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 1
  },
  {
    "id": 236,
    "name": "배루키",
    "type": [
      "격투"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      106,
      107,
      237
    ]
  },
  {
    "id": 237,
    "name": "카포에라",
    "type": [
      "격투"
    ],
    "gen": 2,
    "stage": 2
  },
  {
    "id": 238,
    "name": "뽀뽀라",
    "type": [
      "얼음",
      "에스퍼"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      124
    ]
  },
  {
    "id": 239,
    "name": "에레키드",
    "type": [
      "전기"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      125
    ]
  },
  {
    "id": 240,
    "name": "마그비",
    "type": [
      "불꽃"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      126
    ]
  },
  {
    "id": 241,
    "name": "밀탱크",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 1
  },
  {
    "id": 242,
    "name": "해피너스",
    "type": [
      "노말"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 243,
    "name": "라이코",
    "type": [
      "전기"
    ],
    "gen": 2,
    "stage": 1,
    "legend": true
  },
  {
    "id": 244,
    "name": "앤테이",
    "type": [
      "불꽃"
    ],
    "gen": 2,
    "stage": 1,
    "legend": true
  },
  {
    "id": 245,
    "name": "스이쿤",
    "type": [
      "물"
    ],
    "gen": 2,
    "stage": 1,
    "legend": true
  },
  {
    "id": 246,
    "name": "애버라스",
    "type": [
      "바위",
      "땅"
    ],
    "gen": 2,
    "stage": 1,
    "evolvesTo": [
      247
    ]
  },
  {
    "id": 247,
    "name": "데기라스",
    "type": [
      "바위",
      "땅"
    ],
    "gen": 2,
    "stage": 2,
    "evolvesTo": [
      248
    ]
  },
  {
    "id": 248,
    "name": "마기라스",
    "type": [
      "바위",
      "악"
    ],
    "gen": 2,
    "stage": 3
  },
  {
    "id": 249,
    "name": "루기아",
    "type": [
      "에스퍼",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "legend": true
  },
  {
    "id": 250,
    "name": "칠색조",
    "type": [
      "불꽃",
      "비행"
    ],
    "gen": 2,
    "stage": 1,
    "legend": true
  },
  {
    "id": 251,
    "name": "세레비",
    "type": [
      "에스퍼",
      "풀"
    ],
    "gen": 2,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 252,
    "name": "나무지기",
    "type": [
      "풀"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      253
    ]
  },
  {
    "id": 253,
    "name": "나무돌이",
    "type": [
      "풀"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      254
    ]
  },
  {
    "id": 254,
    "name": "나무킹",
    "type": [
      "풀"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 255,
    "name": "아차모",
    "type": [
      "불꽃"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      256
    ]
  },
  {
    "id": 256,
    "name": "영치코",
    "type": [
      "불꽃",
      "격투"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      257
    ]
  },
  {
    "id": 257,
    "name": "번치코",
    "type": [
      "불꽃",
      "격투"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 258,
    "name": "물짱이",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      259
    ]
  },
  {
    "id": 259,
    "name": "늪짱이",
    "type": [
      "물",
      "땅"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      260
    ]
  },
  {
    "id": 260,
    "name": "대짱이",
    "type": [
      "물",
      "땅"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 261,
    "name": "포챠나",
    "type": [
      "악"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      262
    ]
  },
  {
    "id": 262,
    "name": "그라에나",
    "type": [
      "악"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 263,
    "name": "지그제구리",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      264
    ]
  },
  {
    "id": 264,
    "name": "직구리",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      862
    ]
  },
  {
    "id": 265,
    "name": "개무소",
    "type": [
      "벌레"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      266,
      268
    ]
  },
  {
    "id": 266,
    "name": "실쿤",
    "type": [
      "벌레"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      267
    ]
  },
  {
    "id": 267,
    "name": "뷰티플라이",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 268,
    "name": "카스쿤",
    "type": [
      "벌레"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      269
    ]
  },
  {
    "id": 269,
    "name": "독케일",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 270,
    "name": "연꽃몬",
    "type": [
      "물",
      "풀"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      271
    ]
  },
  {
    "id": 271,
    "name": "로토스",
    "type": [
      "물",
      "풀"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      272
    ]
  },
  {
    "id": 272,
    "name": "로파파",
    "type": [
      "물",
      "풀"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 273,
    "name": "도토링",
    "type": [
      "풀"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      274
    ]
  },
  {
    "id": 274,
    "name": "잎새코",
    "type": [
      "풀",
      "악"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      275
    ]
  },
  {
    "id": 275,
    "name": "다탱구",
    "type": [
      "풀",
      "악"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 276,
    "name": "테일로",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      277
    ]
  },
  {
    "id": 277,
    "name": "스왈로",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 278,
    "name": "갈모매",
    "type": [
      "물",
      "비행"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      279
    ]
  },
  {
    "id": 279,
    "name": "패리퍼",
    "type": [
      "물",
      "비행"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 280,
    "name": "랄토스",
    "type": [
      "에스퍼",
      "페어리"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      281
    ]
  },
  {
    "id": 281,
    "name": "킬리아",
    "type": [
      "에스퍼",
      "페어리"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      282,
      475
    ]
  },
  {
    "id": 282,
    "name": "가디안",
    "type": [
      "에스퍼",
      "페어리"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 283,
    "name": "비구술",
    "type": [
      "벌레",
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      284
    ]
  },
  {
    "id": 284,
    "name": "비나방",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 285,
    "name": "버섯꼬",
    "type": [
      "풀"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      286
    ]
  },
  {
    "id": 286,
    "name": "버섯모",
    "type": [
      "풀",
      "격투"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 287,
    "name": "게을로",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      288
    ]
  },
  {
    "id": 288,
    "name": "발바로",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      289
    ]
  },
  {
    "id": 289,
    "name": "게을킹",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 290,
    "name": "토중몬",
    "type": [
      "벌레",
      "땅"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      291,
      292
    ]
  },
  {
    "id": 291,
    "name": "아이스크",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 292,
    "name": "껍질몬",
    "type": [
      "벌레",
      "고스트"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 293,
    "name": "소곤룡",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      294
    ]
  },
  {
    "id": 294,
    "name": "노공룡",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      295
    ]
  },
  {
    "id": 295,
    "name": "폭음룡",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 296,
    "name": "마크탕",
    "type": [
      "격투"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      297
    ]
  },
  {
    "id": 297,
    "name": "하리뭉",
    "type": [
      "격투"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 298,
    "name": "루리리",
    "type": [
      "노말",
      "페어리"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      183
    ]
  },
  {
    "id": 299,
    "name": "코코파스",
    "type": [
      "바위"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      476
    ]
  },
  {
    "id": 300,
    "name": "에나비",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      301
    ]
  },
  {
    "id": 301,
    "name": "델케티",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 302,
    "name": "깜까미",
    "type": [
      "악",
      "고스트"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 303,
    "name": "입치트",
    "type": [
      "강철",
      "페어리"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 304,
    "name": "가보리",
    "type": [
      "강철",
      "바위"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      305
    ]
  },
  {
    "id": 305,
    "name": "갱도라",
    "type": [
      "강철",
      "바위"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      306
    ]
  },
  {
    "id": 306,
    "name": "보스로라",
    "type": [
      "강철",
      "바위"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 307,
    "name": "요가랑",
    "type": [
      "격투",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      308
    ]
  },
  {
    "id": 308,
    "name": "요가램",
    "type": [
      "격투",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 309,
    "name": "썬더라이",
    "type": [
      "전기"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      310
    ]
  },
  {
    "id": 310,
    "name": "썬더볼트",
    "type": [
      "전기"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 311,
    "name": "플러시",
    "type": [
      "전기"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 312,
    "name": "마이농",
    "type": [
      "전기"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 313,
    "name": "볼비트",
    "type": [
      "벌레"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 314,
    "name": "네오비트",
    "type": [
      "벌레"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 315,
    "name": "로젤리아",
    "type": [
      "풀",
      "독"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      407
    ]
  },
  {
    "id": 316,
    "name": "꼴깍몬",
    "type": [
      "독"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      317
    ]
  },
  {
    "id": 317,
    "name": "꿀꺽몬",
    "type": [
      "독"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 318,
    "name": "샤프니아",
    "type": [
      "물",
      "악"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      319
    ]
  },
  {
    "id": 319,
    "name": "샤크니아",
    "type": [
      "물",
      "악"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 320,
    "name": "고래왕자",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      321
    ]
  },
  {
    "id": 321,
    "name": "고래왕",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 322,
    "name": "둔타",
    "type": [
      "불꽃",
      "땅"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      323
    ]
  },
  {
    "id": 323,
    "name": "폭타",
    "type": [
      "불꽃",
      "땅"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 324,
    "name": "코터스",
    "type": [
      "불꽃"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 325,
    "name": "피그점프",
    "type": [
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      326
    ]
  },
  {
    "id": 326,
    "name": "피그킹",
    "type": [
      "에스퍼"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 327,
    "name": "얼루기",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 328,
    "name": "톱치",
    "type": [
      "땅"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      329
    ]
  },
  {
    "id": 329,
    "name": "비브라바",
    "type": [
      "땅",
      "드래곤"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      330
    ]
  },
  {
    "id": 330,
    "name": "플라이곤",
    "type": [
      "땅",
      "드래곤"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 331,
    "name": "선인왕",
    "type": [
      "풀"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      332
    ]
  },
  {
    "id": 332,
    "name": "밤선인",
    "type": [
      "풀",
      "악"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 333,
    "name": "파비코",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      334
    ]
  },
  {
    "id": 334,
    "name": "파비코리",
    "type": [
      "드래곤",
      "비행"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 335,
    "name": "쟝고",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 336,
    "name": "세비퍼",
    "type": [
      "독"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 337,
    "name": "루나톤",
    "type": [
      "바위",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 338,
    "name": "솔록",
    "type": [
      "바위",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 339,
    "name": "미꾸리",
    "type": [
      "물",
      "땅"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      340
    ]
  },
  {
    "id": 340,
    "name": "메깅",
    "type": [
      "물",
      "땅"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 341,
    "name": "가재군",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      342
    ]
  },
  {
    "id": 342,
    "name": "가재장군",
    "type": [
      "물",
      "악"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 343,
    "name": "오뚝군",
    "type": [
      "땅",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      344
    ]
  },
  {
    "id": 344,
    "name": "점토도리",
    "type": [
      "땅",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 345,
    "name": "릴링",
    "type": [
      "바위",
      "풀"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      346
    ]
  },
  {
    "id": 346,
    "name": "릴리요",
    "type": [
      "바위",
      "풀"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 347,
    "name": "아노딥스",
    "type": [
      "바위",
      "벌레"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      348
    ]
  },
  {
    "id": 348,
    "name": "아말도",
    "type": [
      "바위",
      "벌레"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 349,
    "name": "빈티나",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      350
    ]
  },
  {
    "id": 350,
    "name": "밀로틱",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 351,
    "name": "캐스퐁",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 352,
    "name": "켈리몬",
    "type": [
      "노말"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 353,
    "name": "어둠대신",
    "type": [
      "고스트"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      354
    ]
  },
  {
    "id": 354,
    "name": "다크펫",
    "type": [
      "고스트"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 355,
    "name": "해골몽",
    "type": [
      "고스트"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      356
    ]
  },
  {
    "id": 356,
    "name": "미라몽",
    "type": [
      "고스트"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      477
    ]
  },
  {
    "id": 357,
    "name": "트로피우스",
    "type": [
      "풀",
      "비행"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 358,
    "name": "치렁",
    "type": [
      "에스퍼"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 359,
    "name": "앱솔",
    "type": [
      "악"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 360,
    "name": "마자",
    "type": [
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      202
    ]
  },
  {
    "id": 361,
    "name": "눈꼬마",
    "type": [
      "얼음"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      362,
      478
    ]
  },
  {
    "id": 362,
    "name": "얼음귀신",
    "type": [
      "얼음"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 363,
    "name": "대굴레오",
    "type": [
      "얼음",
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      364
    ]
  },
  {
    "id": 364,
    "name": "씨레오",
    "type": [
      "얼음",
      "물"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      365
    ]
  },
  {
    "id": 365,
    "name": "씨카이저",
    "type": [
      "얼음",
      "물"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 366,
    "name": "진주몽",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      367,
      368
    ]
  },
  {
    "id": 367,
    "name": "헌테일",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 368,
    "name": "분홍장이",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 2
  },
  {
    "id": 369,
    "name": "시라칸",
    "type": [
      "물",
      "바위"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 370,
    "name": "사랑동이",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 1
  },
  {
    "id": 371,
    "name": "아공이",
    "type": [
      "드래곤"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      372
    ]
  },
  {
    "id": 372,
    "name": "쉘곤",
    "type": [
      "드래곤"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      373
    ]
  },
  {
    "id": 373,
    "name": "보만다",
    "type": [
      "드래곤",
      "비행"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 374,
    "name": "메탕",
    "type": [
      "강철",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "evolvesTo": [
      375
    ]
  },
  {
    "id": 375,
    "name": "메탕구",
    "type": [
      "강철",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 2,
    "evolvesTo": [
      376
    ]
  },
  {
    "id": 376,
    "name": "메타그로스",
    "type": [
      "강철",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 3
  },
  {
    "id": 377,
    "name": "레지락",
    "type": [
      "바위"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 378,
    "name": "레지아이스",
    "type": [
      "얼음"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 379,
    "name": "레지스틸",
    "type": [
      "강철"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 380,
    "name": "라티아스",
    "type": [
      "드래곤",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 381,
    "name": "라티오스",
    "type": [
      "드래곤",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 382,
    "name": "가이오가",
    "type": [
      "물"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 383,
    "name": "그란돈",
    "type": [
      "땅"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 384,
    "name": "레쿠쟈",
    "type": [
      "드래곤",
      "비행"
    ],
    "gen": 3,
    "stage": 1,
    "legend": true
  },
  {
    "id": 385,
    "name": "지라치",
    "type": [
      "강철",
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 386,
    "name": "테오키스",
    "type": [
      "에스퍼"
    ],
    "gen": 3,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 387,
    "name": "모부기",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      388
    ]
  },
  {
    "id": 388,
    "name": "수풀부기",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 2,
    "evolvesTo": [
      389
    ]
  },
  {
    "id": 389,
    "name": "토대부기",
    "type": [
      "풀",
      "땅"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 390,
    "name": "불꽃숭이",
    "type": [
      "불꽃"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      391
    ]
  },
  {
    "id": 391,
    "name": "파이숭이",
    "type": [
      "불꽃",
      "격투"
    ],
    "gen": 4,
    "stage": 2,
    "evolvesTo": [
      392
    ]
  },
  {
    "id": 392,
    "name": "초염몽",
    "type": [
      "불꽃",
      "격투"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 393,
    "name": "팽도리",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      394
    ]
  },
  {
    "id": 394,
    "name": "팽태자",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 2,
    "evolvesTo": [
      395
    ]
  },
  {
    "id": 395,
    "name": "엠페르트",
    "type": [
      "물",
      "강철"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 396,
    "name": "찌르꼬",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      397
    ]
  },
  {
    "id": 397,
    "name": "찌르버드",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 4,
    "stage": 2,
    "evolvesTo": [
      398
    ]
  },
  {
    "id": 398,
    "name": "찌르호크",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 399,
    "name": "비버니",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      400
    ]
  },
  {
    "id": 400,
    "name": "비버통",
    "type": [
      "노말",
      "물"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 401,
    "name": "귀뚤뚜기",
    "type": [
      "벌레"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      402
    ]
  },
  {
    "id": 402,
    "name": "귀뚤톡크",
    "type": [
      "벌레"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 403,
    "name": "꼬링크",
    "type": [
      "전기"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      404
    ]
  },
  {
    "id": 404,
    "name": "럭시오",
    "type": [
      "전기"
    ],
    "gen": 4,
    "stage": 2,
    "evolvesTo": [
      405
    ]
  },
  {
    "id": 405,
    "name": "렌트라",
    "type": [
      "전기"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 406,
    "name": "꼬몽울",
    "type": [
      "풀",
      "독"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      315
    ]
  },
  {
    "id": 407,
    "name": "로즈레이드",
    "type": [
      "풀",
      "독"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 408,
    "name": "두개도스",
    "type": [
      "바위"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      409
    ]
  },
  {
    "id": 409,
    "name": "램펄드",
    "type": [
      "바위"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 410,
    "name": "방패톱스",
    "type": [
      "바위",
      "강철"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      411
    ]
  },
  {
    "id": 411,
    "name": "바리톱스",
    "type": [
      "바위",
      "강철"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 412,
    "name": "도롱충이",
    "type": [
      "벌레"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      413,
      414
    ]
  },
  {
    "id": 413,
    "name": "도롱마담",
    "type": [
      "벌레",
      "풀"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 414,
    "name": "나메일",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 415,
    "name": "세꿀버리",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      416
    ]
  },
  {
    "id": 416,
    "name": "비퀸",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 417,
    "name": "파치리스",
    "type": [
      "전기"
    ],
    "gen": 4,
    "stage": 1
  },
  {
    "id": 418,
    "name": "브이젤",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      419
    ]
  },
  {
    "id": 419,
    "name": "플로젤",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 420,
    "name": "체리버",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      421
    ]
  },
  {
    "id": 421,
    "name": "체리꼬",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 422,
    "name": "깝질무",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      423
    ]
  },
  {
    "id": 423,
    "name": "트리토돈",
    "type": [
      "물",
      "땅"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 424,
    "name": "겟핸보숭",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 425,
    "name": "흔들풍손",
    "type": [
      "고스트",
      "비행"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      426
    ]
  },
  {
    "id": 426,
    "name": "둥실라이드",
    "type": [
      "고스트",
      "비행"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 427,
    "name": "이어롤",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      428
    ]
  },
  {
    "id": 428,
    "name": "이어롭",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 429,
    "name": "무우마직",
    "type": [
      "고스트"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 430,
    "name": "돈크로우",
    "type": [
      "악",
      "비행"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 431,
    "name": "나옹마",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      432
    ]
  },
  {
    "id": 432,
    "name": "몬냥이",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 433,
    "name": "랑딸랑",
    "type": [
      "에스퍼"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      358
    ]
  },
  {
    "id": 434,
    "name": "스컹뿡",
    "type": [
      "독",
      "악"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      435
    ]
  },
  {
    "id": 435,
    "name": "스컹탱크",
    "type": [
      "독",
      "악"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 436,
    "name": "동미러",
    "type": [
      "강철",
      "에스퍼"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      437
    ]
  },
  {
    "id": 437,
    "name": "동탁군",
    "type": [
      "강철",
      "에스퍼"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 438,
    "name": "꼬지지",
    "type": [
      "바위"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      185
    ]
  },
  {
    "id": 439,
    "name": "흉내내",
    "type": [
      "에스퍼",
      "페어리"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      122
    ]
  },
  {
    "id": 440,
    "name": "핑복",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      113
    ]
  },
  {
    "id": 441,
    "name": "페라페",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 4,
    "stage": 1
  },
  {
    "id": 442,
    "name": "화강돌",
    "type": [
      "고스트",
      "악"
    ],
    "gen": 4,
    "stage": 1
  },
  {
    "id": 443,
    "name": "딥상어동",
    "type": [
      "드래곤",
      "땅"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      444
    ]
  },
  {
    "id": 444,
    "name": "한바이트",
    "type": [
      "드래곤",
      "땅"
    ],
    "gen": 4,
    "stage": 2,
    "evolvesTo": [
      445
    ]
  },
  {
    "id": 445,
    "name": "한카리아스",
    "type": [
      "드래곤",
      "땅"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 446,
    "name": "먹고자",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      143
    ]
  },
  {
    "id": 447,
    "name": "리오르",
    "type": [
      "격투"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      448
    ]
  },
  {
    "id": 448,
    "name": "루카리오",
    "type": [
      "격투",
      "강철"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 449,
    "name": "히포포타스",
    "type": [
      "땅"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      450
    ]
  },
  {
    "id": 450,
    "name": "하마돈",
    "type": [
      "땅"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 451,
    "name": "스콜피",
    "type": [
      "독",
      "벌레"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      452
    ]
  },
  {
    "id": 452,
    "name": "드래피온",
    "type": [
      "독",
      "악"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 453,
    "name": "삐딱구리",
    "type": [
      "독",
      "격투"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      454
    ]
  },
  {
    "id": 454,
    "name": "독개굴",
    "type": [
      "독",
      "격투"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 455,
    "name": "무스틈니",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 1
  },
  {
    "id": 456,
    "name": "형광어",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      457
    ]
  },
  {
    "id": 457,
    "name": "네오라이트",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 458,
    "name": "타만타",
    "type": [
      "물",
      "비행"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      226
    ]
  },
  {
    "id": 459,
    "name": "눈쓰개",
    "type": [
      "풀",
      "얼음"
    ],
    "gen": 4,
    "stage": 1,
    "evolvesTo": [
      460
    ]
  },
  {
    "id": 460,
    "name": "눈설왕",
    "type": [
      "풀",
      "얼음"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 461,
    "name": "포푸니라",
    "type": [
      "악",
      "얼음"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 462,
    "name": "자포코일",
    "type": [
      "전기",
      "강철"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 463,
    "name": "내룸벨트",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 464,
    "name": "거대코뿌리",
    "type": [
      "땅",
      "바위"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 465,
    "name": "덩쿠림보",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 466,
    "name": "에레키블",
    "type": [
      "전기"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 467,
    "name": "마그마번",
    "type": [
      "불꽃"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 468,
    "name": "토게키스",
    "type": [
      "페어리",
      "비행"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 469,
    "name": "메가자리",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 470,
    "name": "리피아",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 471,
    "name": "글레이시아",
    "type": [
      "얼음"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 472,
    "name": "글라이온",
    "type": [
      "땅",
      "비행"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 473,
    "name": "맘모꾸리",
    "type": [
      "얼음",
      "땅"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 474,
    "name": "폴리곤Z",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 475,
    "name": "엘레이드",
    "type": [
      "에스퍼",
      "격투"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 476,
    "name": "대코파스",
    "type": [
      "바위",
      "강철"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 477,
    "name": "야느와르몽",
    "type": [
      "고스트"
    ],
    "gen": 4,
    "stage": 3
  },
  {
    "id": 478,
    "name": "눈여아",
    "type": [
      "얼음",
      "고스트"
    ],
    "gen": 4,
    "stage": 2
  },
  {
    "id": 479,
    "name": "로토무",
    "type": [
      "전기",
      "고스트"
    ],
    "gen": 4,
    "stage": 1
  },
  {
    "id": 480,
    "name": "유크시",
    "type": [
      "에스퍼"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 481,
    "name": "엠라이트",
    "type": [
      "에스퍼"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 482,
    "name": "아그놈",
    "type": [
      "에스퍼"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 483,
    "name": "디아루가",
    "type": [
      "강철",
      "드래곤"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 484,
    "name": "펄기아",
    "type": [
      "물",
      "드래곤"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 485,
    "name": "히드런",
    "type": [
      "불꽃",
      "강철"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 486,
    "name": "레지기가스",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 487,
    "name": "기라티나",
    "type": [
      "고스트",
      "드래곤"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 488,
    "name": "크레세리아",
    "type": [
      "에스퍼"
    ],
    "gen": 4,
    "stage": 1,
    "legend": true
  },
  {
    "id": 489,
    "name": "피오네",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 490,
    "name": "마나피",
    "type": [
      "물"
    ],
    "gen": 4,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 491,
    "name": "다크라이",
    "type": [
      "악"
    ],
    "gen": 4,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 492,
    "name": "쉐이미",
    "type": [
      "풀"
    ],
    "gen": 4,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 493,
    "name": "아르세우스",
    "type": [
      "노말"
    ],
    "gen": 4,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 494,
    "name": "비크티니",
    "type": [
      "에스퍼",
      "불꽃"
    ],
    "gen": 5,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 495,
    "name": "주리비얀",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      496
    ]
  },
  {
    "id": 496,
    "name": "샤비",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      497
    ]
  },
  {
    "id": 497,
    "name": "샤로다",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 498,
    "name": "뚜꾸리",
    "type": [
      "불꽃"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      499
    ]
  },
  {
    "id": 499,
    "name": "차오꿀",
    "type": [
      "불꽃",
      "격투"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      500
    ]
  },
  {
    "id": 500,
    "name": "염무왕",
    "type": [
      "불꽃",
      "격투"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 501,
    "name": "수댕이",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      502
    ]
  },
  {
    "id": 502,
    "name": "쌍검자비",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      503
    ]
  },
  {
    "id": 503,
    "name": "대검귀",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 504,
    "name": "보르쥐",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      505
    ]
  },
  {
    "id": 505,
    "name": "보르그",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 506,
    "name": "요테리",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      507
    ]
  },
  {
    "id": 507,
    "name": "하데리어",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      508
    ]
  },
  {
    "id": 508,
    "name": "바랜드",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 509,
    "name": "쌔비냥",
    "type": [
      "악"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      510
    ]
  },
  {
    "id": 510,
    "name": "레파르다스",
    "type": [
      "악"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 511,
    "name": "야나프",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      512
    ]
  },
  {
    "id": 512,
    "name": "야나키",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 513,
    "name": "바오프",
    "type": [
      "불꽃"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      514
    ]
  },
  {
    "id": 514,
    "name": "바오키",
    "type": [
      "불꽃"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 515,
    "name": "앗차프",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      516
    ]
  },
  {
    "id": 516,
    "name": "앗차키",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 517,
    "name": "몽나",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      518
    ]
  },
  {
    "id": 518,
    "name": "몽얌나",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 519,
    "name": "콩둘기",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      520
    ]
  },
  {
    "id": 520,
    "name": "유토브",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      521
    ]
  },
  {
    "id": 521,
    "name": "켄호로우",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 522,
    "name": "줄뮤마",
    "type": [
      "전기"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      523
    ]
  },
  {
    "id": 523,
    "name": "제브라이카",
    "type": [
      "전기"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 524,
    "name": "단굴",
    "type": [
      "바위"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      525
    ]
  },
  {
    "id": 525,
    "name": "암트르",
    "type": [
      "바위"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      526
    ]
  },
  {
    "id": 526,
    "name": "기가이어스",
    "type": [
      "바위"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 527,
    "name": "또르박쥐",
    "type": [
      "에스퍼",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      528
    ]
  },
  {
    "id": 528,
    "name": "맘박쥐",
    "type": [
      "에스퍼",
      "비행"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 529,
    "name": "두더류",
    "type": [
      "땅"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      530
    ]
  },
  {
    "id": 530,
    "name": "몰드류",
    "type": [
      "땅",
      "강철"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 531,
    "name": "다부니",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 532,
    "name": "으랏차",
    "type": [
      "격투"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      533
    ]
  },
  {
    "id": 533,
    "name": "토쇠골",
    "type": [
      "격투"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      534
    ]
  },
  {
    "id": 534,
    "name": "노보청",
    "type": [
      "격투"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 535,
    "name": "동챙이",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      536
    ]
  },
  {
    "id": 536,
    "name": "두까비",
    "type": [
      "물",
      "땅"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      537
    ]
  },
  {
    "id": 537,
    "name": "두빅굴",
    "type": [
      "물",
      "땅"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 538,
    "name": "던지미",
    "type": [
      "격투"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 539,
    "name": "타격귀",
    "type": [
      "격투"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 540,
    "name": "두르보",
    "type": [
      "벌레",
      "풀"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      541
    ]
  },
  {
    "id": 541,
    "name": "두르쿤",
    "type": [
      "벌레",
      "풀"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      542
    ]
  },
  {
    "id": 542,
    "name": "모아머",
    "type": [
      "벌레",
      "풀"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 543,
    "name": "마디네",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      544
    ]
  },
  {
    "id": 544,
    "name": "휠구",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      545
    ]
  },
  {
    "id": 545,
    "name": "펜드라",
    "type": [
      "벌레",
      "독"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 546,
    "name": "소미안",
    "type": [
      "풀",
      "페어리"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      547
    ]
  },
  {
    "id": 547,
    "name": "엘풍",
    "type": [
      "풀",
      "페어리"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 548,
    "name": "치릴리",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      549
    ]
  },
  {
    "id": 549,
    "name": "드레디어",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 550,
    "name": "배쓰나이",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      902
    ]
  },
  {
    "id": 551,
    "name": "깜눈크",
    "type": [
      "땅",
      "악"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      552
    ]
  },
  {
    "id": 552,
    "name": "악비르",
    "type": [
      "땅",
      "악"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      553
    ]
  },
  {
    "id": 553,
    "name": "악비아르",
    "type": [
      "땅",
      "악"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 554,
    "name": "달막화",
    "type": [
      "불꽃"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      555
    ]
  },
  {
    "id": 555,
    "name": "불비달마",
    "type": [
      "불꽃"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 556,
    "name": "마라카치",
    "type": [
      "풀"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 557,
    "name": "돌살이",
    "type": [
      "벌레",
      "바위"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      558
    ]
  },
  {
    "id": 558,
    "name": "암팰리스",
    "type": [
      "벌레",
      "바위"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 559,
    "name": "곤율랭",
    "type": [
      "악",
      "격투"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      560
    ]
  },
  {
    "id": 560,
    "name": "곤율거니",
    "type": [
      "악",
      "격투"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 561,
    "name": "심보러",
    "type": [
      "에스퍼",
      "비행"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 562,
    "name": "데스마스",
    "type": [
      "고스트"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      563,
      867
    ]
  },
  {
    "id": 563,
    "name": "데스니칸",
    "type": [
      "고스트"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 564,
    "name": "프로토가",
    "type": [
      "물",
      "바위"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      565
    ]
  },
  {
    "id": 565,
    "name": "늑골라",
    "type": [
      "물",
      "바위"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 566,
    "name": "아켄",
    "type": [
      "바위",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      567
    ]
  },
  {
    "id": 567,
    "name": "아케오스",
    "type": [
      "바위",
      "비행"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 568,
    "name": "깨봉이",
    "type": [
      "독"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      569
    ]
  },
  {
    "id": 569,
    "name": "더스트나",
    "type": [
      "독"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 570,
    "name": "조로아",
    "type": [
      "악"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      571
    ]
  },
  {
    "id": 571,
    "name": "조로아크",
    "type": [
      "악"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 572,
    "name": "치라미",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      573
    ]
  },
  {
    "id": 573,
    "name": "치라치노",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 574,
    "name": "고디탱",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      575
    ]
  },
  {
    "id": 575,
    "name": "고디보미",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      576
    ]
  },
  {
    "id": 576,
    "name": "고디모아젤",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 577,
    "name": "유니란",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      578
    ]
  },
  {
    "id": 578,
    "name": "듀란",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      579
    ]
  },
  {
    "id": 579,
    "name": "란쿨루스",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 580,
    "name": "꼬지보리",
    "type": [
      "물",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      581
    ]
  },
  {
    "id": 581,
    "name": "스완나",
    "type": [
      "물",
      "비행"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 582,
    "name": "바닐프티",
    "type": [
      "얼음"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      583
    ]
  },
  {
    "id": 583,
    "name": "바닐리치",
    "type": [
      "얼음"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      584
    ]
  },
  {
    "id": 584,
    "name": "배바닐라",
    "type": [
      "얼음"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 585,
    "name": "사철록",
    "type": [
      "노말",
      "풀"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      586
    ]
  },
  {
    "id": 586,
    "name": "바라철록",
    "type": [
      "노말",
      "풀"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 587,
    "name": "에몽가",
    "type": [
      "전기",
      "비행"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 588,
    "name": "딱정곤",
    "type": [
      "벌레"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      589
    ]
  },
  {
    "id": 589,
    "name": "슈바르고",
    "type": [
      "벌레",
      "강철"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 590,
    "name": "깜놀버슬",
    "type": [
      "풀",
      "독"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      591
    ]
  },
  {
    "id": 591,
    "name": "뽀록나",
    "type": [
      "풀",
      "독"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 592,
    "name": "탱그릴",
    "type": [
      "물",
      "고스트"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      593
    ]
  },
  {
    "id": 593,
    "name": "탱탱겔",
    "type": [
      "물",
      "고스트"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 594,
    "name": "맘복치",
    "type": [
      "물"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 595,
    "name": "파쪼옥",
    "type": [
      "벌레",
      "전기"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      596
    ]
  },
  {
    "id": 596,
    "name": "전툴라",
    "type": [
      "벌레",
      "전기"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 597,
    "name": "철시드",
    "type": [
      "풀",
      "강철"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      598
    ]
  },
  {
    "id": 598,
    "name": "너트령",
    "type": [
      "풀",
      "강철"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 599,
    "name": "기어르",
    "type": [
      "강철"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      600
    ]
  },
  {
    "id": 600,
    "name": "기기어르",
    "type": [
      "강철"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      601
    ]
  },
  {
    "id": 601,
    "name": "기기기어르",
    "type": [
      "강철"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 602,
    "name": "저리어",
    "type": [
      "전기"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      603
    ]
  },
  {
    "id": 603,
    "name": "저리릴",
    "type": [
      "전기"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      604
    ]
  },
  {
    "id": 604,
    "name": "저리더프",
    "type": [
      "전기"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 605,
    "name": "리그레",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      606
    ]
  },
  {
    "id": 606,
    "name": "벰크",
    "type": [
      "에스퍼"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 607,
    "name": "불켜미",
    "type": [
      "고스트",
      "불꽃"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      608
    ]
  },
  {
    "id": 608,
    "name": "램프라",
    "type": [
      "고스트",
      "불꽃"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      609
    ]
  },
  {
    "id": 609,
    "name": "샹델라",
    "type": [
      "고스트",
      "불꽃"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 610,
    "name": "터검니",
    "type": [
      "드래곤"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      611
    ]
  },
  {
    "id": 611,
    "name": "액슨도",
    "type": [
      "드래곤"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      612
    ]
  },
  {
    "id": 612,
    "name": "액스라이즈",
    "type": [
      "드래곤"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 613,
    "name": "코고미",
    "type": [
      "얼음"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      614
    ]
  },
  {
    "id": 614,
    "name": "툰베어",
    "type": [
      "얼음"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 615,
    "name": "프리지오",
    "type": [
      "얼음"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 616,
    "name": "쪼마리",
    "type": [
      "벌레"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      617
    ]
  },
  {
    "id": 617,
    "name": "어지리더",
    "type": [
      "벌레"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 618,
    "name": "메더",
    "type": [
      "땅",
      "전기"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 619,
    "name": "비조푸",
    "type": [
      "격투"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      620
    ]
  },
  {
    "id": 620,
    "name": "비조도",
    "type": [
      "격투"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 621,
    "name": "크리만",
    "type": [
      "드래곤"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 622,
    "name": "골비람",
    "type": [
      "땅",
      "고스트"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      623
    ]
  },
  {
    "id": 623,
    "name": "골루그",
    "type": [
      "땅",
      "고스트"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 624,
    "name": "자망칼",
    "type": [
      "악",
      "강철"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      625
    ]
  },
  {
    "id": 625,
    "name": "절각참",
    "type": [
      "악",
      "강철"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      983
    ]
  },
  {
    "id": 626,
    "name": "버프론",
    "type": [
      "노말"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 627,
    "name": "수리둥보",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      628
    ]
  },
  {
    "id": 628,
    "name": "워글",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 629,
    "name": "벌차이",
    "type": [
      "악",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      630
    ]
  },
  {
    "id": 630,
    "name": "버랜지나",
    "type": [
      "악",
      "비행"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 631,
    "name": "앤티골",
    "type": [
      "불꽃"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 632,
    "name": "아이앤트",
    "type": [
      "벌레",
      "강철"
    ],
    "gen": 5,
    "stage": 1
  },
  {
    "id": 633,
    "name": "모노두",
    "type": [
      "악",
      "드래곤"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      634
    ]
  },
  {
    "id": 634,
    "name": "디헤드",
    "type": [
      "악",
      "드래곤"
    ],
    "gen": 5,
    "stage": 2,
    "evolvesTo": [
      635
    ]
  },
  {
    "id": 635,
    "name": "삼삼드래",
    "type": [
      "악",
      "드래곤"
    ],
    "gen": 5,
    "stage": 3
  },
  {
    "id": 636,
    "name": "활화르바",
    "type": [
      "벌레",
      "불꽃"
    ],
    "gen": 5,
    "stage": 1,
    "evolvesTo": [
      637
    ]
  },
  {
    "id": 637,
    "name": "불카모스",
    "type": [
      "벌레",
      "불꽃"
    ],
    "gen": 5,
    "stage": 2
  },
  {
    "id": 638,
    "name": "코바르온",
    "type": [
      "강철",
      "격투"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 639,
    "name": "테라키온",
    "type": [
      "바위",
      "격투"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 640,
    "name": "비리디온",
    "type": [
      "풀",
      "격투"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 641,
    "name": "토네로스",
    "type": [
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 642,
    "name": "볼트로스",
    "type": [
      "전기",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 643,
    "name": "레시라무",
    "type": [
      "드래곤",
      "불꽃"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 644,
    "name": "제크로무",
    "type": [
      "드래곤",
      "전기"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 645,
    "name": "랜드로스",
    "type": [
      "땅",
      "비행"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 646,
    "name": "큐레무",
    "type": [
      "드래곤",
      "얼음"
    ],
    "gen": 5,
    "stage": 1,
    "legend": true
  },
  {
    "id": 647,
    "name": "케르디오",
    "type": [
      "물",
      "격투"
    ],
    "gen": 5,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 648,
    "name": "메로엣타",
    "type": [
      "노말",
      "에스퍼"
    ],
    "gen": 5,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 649,
    "name": "게노세크트",
    "type": [
      "벌레",
      "강철"
    ],
    "gen": 5,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 650,
    "name": "도치마론",
    "type": [
      "풀"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      651
    ]
  },
  {
    "id": 651,
    "name": "도치보구",
    "type": [
      "풀"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      652
    ]
  },
  {
    "id": 652,
    "name": "브리가론",
    "type": [
      "풀",
      "격투"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 653,
    "name": "푸호꼬",
    "type": [
      "불꽃"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      654
    ]
  },
  {
    "id": 654,
    "name": "테르나",
    "type": [
      "불꽃"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      655
    ]
  },
  {
    "id": 655,
    "name": "마폭시",
    "type": [
      "불꽃",
      "에스퍼"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 656,
    "name": "개구마르",
    "type": [
      "물"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      657
    ]
  },
  {
    "id": 657,
    "name": "개굴반장",
    "type": [
      "물"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      658
    ]
  },
  {
    "id": 658,
    "name": "개굴닌자",
    "type": [
      "물",
      "악"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 659,
    "name": "파르빗",
    "type": [
      "노말"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      660
    ]
  },
  {
    "id": 660,
    "name": "파르토",
    "type": [
      "노말",
      "땅"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 661,
    "name": "화살꼬빈",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      662
    ]
  },
  {
    "id": 662,
    "name": "불화살빈",
    "type": [
      "불꽃",
      "비행"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      663
    ]
  },
  {
    "id": 663,
    "name": "파이어로",
    "type": [
      "불꽃",
      "비행"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 664,
    "name": "분이벌레",
    "type": [
      "벌레"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      665
    ]
  },
  {
    "id": 665,
    "name": "분떠도리",
    "type": [
      "벌레"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      666
    ]
  },
  {
    "id": 666,
    "name": "비비용",
    "type": [
      "벌레",
      "비행"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 667,
    "name": "레오꼬",
    "type": [
      "불꽃",
      "노말"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      668
    ]
  },
  {
    "id": 668,
    "name": "화염레오",
    "type": [
      "불꽃",
      "노말"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 669,
    "name": "플라베베",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      670
    ]
  },
  {
    "id": 670,
    "name": "플라엣테",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      671
    ]
  },
  {
    "id": 671,
    "name": "플라제스",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 672,
    "name": "메이클",
    "type": [
      "풀"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      673
    ]
  },
  {
    "id": 673,
    "name": "고고트",
    "type": [
      "풀"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 674,
    "name": "판짱",
    "type": [
      "격투"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      675
    ]
  },
  {
    "id": 675,
    "name": "부란다",
    "type": [
      "격투",
      "악"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 676,
    "name": "트리미앙",
    "type": [
      "노말"
    ],
    "gen": 6,
    "stage": 1
  },
  {
    "id": 677,
    "name": "냐스퍼",
    "type": [
      "에스퍼"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      678
    ]
  },
  {
    "id": 678,
    "name": "냐오닉스",
    "type": [
      "에스퍼"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 679,
    "name": "단칼빙",
    "type": [
      "강철",
      "고스트"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      680
    ]
  },
  {
    "id": 680,
    "name": "쌍검킬",
    "type": [
      "강철",
      "고스트"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      681
    ]
  },
  {
    "id": 681,
    "name": "킬가르도",
    "type": [
      "강철",
      "고스트"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 682,
    "name": "슈쁘",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      683
    ]
  },
  {
    "id": 683,
    "name": "프레프티르",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 684,
    "name": "나룸퍼프",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      685
    ]
  },
  {
    "id": 685,
    "name": "나루림",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 686,
    "name": "오케이징",
    "type": [
      "악",
      "에스퍼"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      687
    ]
  },
  {
    "id": 687,
    "name": "칼라마네로",
    "type": [
      "악",
      "에스퍼"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 688,
    "name": "거북손손",
    "type": [
      "바위",
      "물"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      689
    ]
  },
  {
    "id": 689,
    "name": "거북손데스",
    "type": [
      "바위",
      "물"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 690,
    "name": "수레기",
    "type": [
      "독",
      "물"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      691
    ]
  },
  {
    "id": 691,
    "name": "드래캄",
    "type": [
      "독",
      "드래곤"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 692,
    "name": "완철포",
    "type": [
      "물"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      693
    ]
  },
  {
    "id": 693,
    "name": "블로스터",
    "type": [
      "물"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 694,
    "name": "목도리키텔",
    "type": [
      "전기",
      "노말"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      695
    ]
  },
  {
    "id": 695,
    "name": "일레도리자드",
    "type": [
      "전기",
      "노말"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 696,
    "name": "티고라스",
    "type": [
      "바위",
      "드래곤"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      697
    ]
  },
  {
    "id": 697,
    "name": "견고라스",
    "type": [
      "바위",
      "드래곤"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 698,
    "name": "아마루스",
    "type": [
      "바위",
      "얼음"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      699
    ]
  },
  {
    "id": 699,
    "name": "아마루르가",
    "type": [
      "바위",
      "얼음"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 700,
    "name": "님피아",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 701,
    "name": "루차불",
    "type": [
      "격투",
      "비행"
    ],
    "gen": 6,
    "stage": 1
  },
  {
    "id": 702,
    "name": "데덴네",
    "type": [
      "전기",
      "페어리"
    ],
    "gen": 6,
    "stage": 1
  },
  {
    "id": 703,
    "name": "멜리시",
    "type": [
      "바위",
      "페어리"
    ],
    "gen": 6,
    "stage": 1
  },
  {
    "id": 704,
    "name": "미끄메라",
    "type": [
      "드래곤"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      705
    ]
  },
  {
    "id": 705,
    "name": "미끄네일",
    "type": [
      "드래곤"
    ],
    "gen": 6,
    "stage": 2,
    "evolvesTo": [
      706
    ]
  },
  {
    "id": 706,
    "name": "미끄래곤",
    "type": [
      "드래곤"
    ],
    "gen": 6,
    "stage": 3
  },
  {
    "id": 707,
    "name": "클레피",
    "type": [
      "강철",
      "페어리"
    ],
    "gen": 6,
    "stage": 1
  },
  {
    "id": 708,
    "name": "나목령",
    "type": [
      "고스트",
      "풀"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      709
    ]
  },
  {
    "id": 709,
    "name": "대로트",
    "type": [
      "고스트",
      "풀"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 710,
    "name": "호바귀",
    "type": [
      "고스트",
      "풀"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      711
    ]
  },
  {
    "id": 711,
    "name": "펌킨인",
    "type": [
      "고스트",
      "풀"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 712,
    "name": "꽁어름",
    "type": [
      "얼음"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      713
    ]
  },
  {
    "id": 713,
    "name": "크레베이스",
    "type": [
      "얼음"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 714,
    "name": "음뱃",
    "type": [
      "비행",
      "드래곤"
    ],
    "gen": 6,
    "stage": 1,
    "evolvesTo": [
      715
    ]
  },
  {
    "id": 715,
    "name": "음번",
    "type": [
      "비행",
      "드래곤"
    ],
    "gen": 6,
    "stage": 2
  },
  {
    "id": 716,
    "name": "제르네아스",
    "type": [
      "페어리"
    ],
    "gen": 6,
    "stage": 1,
    "legend": true
  },
  {
    "id": 717,
    "name": "이벨타르",
    "type": [
      "악",
      "비행"
    ],
    "gen": 6,
    "stage": 1,
    "legend": true
  },
  {
    "id": 718,
    "name": "지가르데",
    "type": [
      "드래곤",
      "땅"
    ],
    "gen": 6,
    "stage": 1,
    "legend": true
  },
  {
    "id": 719,
    "name": "디안시",
    "type": [
      "바위",
      "페어리"
    ],
    "gen": 6,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 720,
    "name": "후파",
    "type": [
      "에스퍼",
      "고스트"
    ],
    "gen": 6,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 721,
    "name": "볼케니온",
    "type": [
      "불꽃",
      "물"
    ],
    "gen": 6,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 722,
    "name": "나몰빼미",
    "type": [
      "풀",
      "비행"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      723
    ]
  },
  {
    "id": 723,
    "name": "빼미스로우",
    "type": [
      "풀",
      "비행"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      724
    ]
  },
  {
    "id": 724,
    "name": "모크나이퍼",
    "type": [
      "풀",
      "고스트"
    ],
    "gen": 7,
    "stage": 3
  },
  {
    "id": 725,
    "name": "냐오불",
    "type": [
      "불꽃"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      726
    ]
  },
  {
    "id": 726,
    "name": "냐오히트",
    "type": [
      "불꽃"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      727
    ]
  },
  {
    "id": 727,
    "name": "어흥염",
    "type": [
      "불꽃",
      "악"
    ],
    "gen": 7,
    "stage": 3
  },
  {
    "id": 728,
    "name": "누리공",
    "type": [
      "물"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      729
    ]
  },
  {
    "id": 729,
    "name": "키요공",
    "type": [
      "물"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      730
    ]
  },
  {
    "id": 730,
    "name": "누리레느",
    "type": [
      "물",
      "페어리"
    ],
    "gen": 7,
    "stage": 3
  },
  {
    "id": 731,
    "name": "콕코구리",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      732
    ]
  },
  {
    "id": 732,
    "name": "크라파",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      733
    ]
  },
  {
    "id": 733,
    "name": "왕큰부리",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 7,
    "stage": 3
  },
  {
    "id": 734,
    "name": "영구스",
    "type": [
      "노말"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      735
    ]
  },
  {
    "id": 735,
    "name": "형사구스",
    "type": [
      "노말"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 736,
    "name": "턱지충이",
    "type": [
      "벌레"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      737
    ]
  },
  {
    "id": 737,
    "name": "전지충이",
    "type": [
      "벌레",
      "전기"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      738
    ]
  },
  {
    "id": 738,
    "name": "투구뿌논",
    "type": [
      "벌레",
      "전기"
    ],
    "gen": 7,
    "stage": 3
  },
  {
    "id": 739,
    "name": "오기지게",
    "type": [
      "격투"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      740
    ]
  },
  {
    "id": 740,
    "name": "모단단게",
    "type": [
      "격투",
      "얼음"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 741,
    "name": "춤추새",
    "type": [
      "불꽃",
      "비행"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 742,
    "name": "에블리",
    "type": [
      "벌레",
      "페어리"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      743
    ]
  },
  {
    "id": 743,
    "name": "에리본",
    "type": [
      "벌레",
      "페어리"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 744,
    "name": "암멍이",
    "type": [
      "바위"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      745
    ]
  },
  {
    "id": 745,
    "name": "루가루암",
    "type": [
      "바위"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 746,
    "name": "약어리",
    "type": [
      "물"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 747,
    "name": "시마사리",
    "type": [
      "독",
      "물"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      748
    ]
  },
  {
    "id": 748,
    "name": "더시마사리",
    "type": [
      "독",
      "물"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 749,
    "name": "머드나기",
    "type": [
      "땅"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      750
    ]
  },
  {
    "id": 750,
    "name": "만마드",
    "type": [
      "땅"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 751,
    "name": "물거미",
    "type": [
      "물",
      "벌레"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      752
    ]
  },
  {
    "id": 752,
    "name": "깨비물거미",
    "type": [
      "물",
      "벌레"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 753,
    "name": "짜랑랑",
    "type": [
      "풀"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      754
    ]
  },
  {
    "id": 754,
    "name": "라란티스",
    "type": [
      "풀"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 755,
    "name": "자마슈",
    "type": [
      "풀",
      "페어리"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      756
    ]
  },
  {
    "id": 756,
    "name": "마셰이드",
    "type": [
      "풀",
      "페어리"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 757,
    "name": "야도뇽",
    "type": [
      "독",
      "불꽃"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      758
    ]
  },
  {
    "id": 758,
    "name": "염뉴트",
    "type": [
      "독",
      "불꽃"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 759,
    "name": "포곰곰",
    "type": [
      "노말",
      "격투"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      760
    ]
  },
  {
    "id": 760,
    "name": "이븐곰",
    "type": [
      "노말",
      "격투"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 761,
    "name": "달콤아",
    "type": [
      "풀"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      762
    ]
  },
  {
    "id": 762,
    "name": "달무리나",
    "type": [
      "풀"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      763
    ]
  },
  {
    "id": 763,
    "name": "달코퀸",
    "type": [
      "풀"
    ],
    "gen": 7,
    "stage": 3
  },
  {
    "id": 764,
    "name": "큐아링",
    "type": [
      "페어리"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 765,
    "name": "하랑우탄",
    "type": [
      "노말",
      "에스퍼"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 766,
    "name": "내던숭이",
    "type": [
      "격투"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 767,
    "name": "꼬시레",
    "type": [
      "벌레",
      "물"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      768
    ]
  },
  {
    "id": 768,
    "name": "갑주무사",
    "type": [
      "벌레",
      "물"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 769,
    "name": "모래꿍",
    "type": [
      "고스트",
      "땅"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      770
    ]
  },
  {
    "id": 770,
    "name": "모래성이당",
    "type": [
      "고스트",
      "땅"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 771,
    "name": "해무기",
    "type": [
      "물"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 772,
    "name": "타입:널",
    "type": [
      "노말"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      773
    ],
    "legend": true
  },
  {
    "id": 773,
    "name": "실버디",
    "type": [
      "노말"
    ],
    "gen": 7,
    "stage": 2,
    "legend": true
  },
  {
    "id": 774,
    "name": "메테노",
    "type": [
      "바위",
      "비행"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 775,
    "name": "자말라",
    "type": [
      "노말"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 776,
    "name": "폭거북스",
    "type": [
      "불꽃",
      "드래곤"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 777,
    "name": "토게데마루",
    "type": [
      "전기",
      "강철"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 778,
    "name": "따라큐",
    "type": [
      "고스트",
      "페어리"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 779,
    "name": "치갈기",
    "type": [
      "물",
      "에스퍼"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 780,
    "name": "할비롱",
    "type": [
      "노말",
      "드래곤"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 781,
    "name": "타타륜",
    "type": [
      "고스트",
      "풀"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 782,
    "name": "짜랑꼬",
    "type": [
      "드래곤"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      783
    ]
  },
  {
    "id": 783,
    "name": "짜랑고우",
    "type": [
      "드래곤",
      "격투"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      784
    ]
  },
  {
    "id": 784,
    "name": "짜랑고우거",
    "type": [
      "드래곤",
      "격투"
    ],
    "gen": 7,
    "stage": 3
  },
  {
    "id": 785,
    "name": "카푸꼬꼬꼭",
    "type": [
      "전기",
      "페어리"
    ],
    "gen": 7,
    "stage": 1,
    "legend": true
  },
  {
    "id": 786,
    "name": "카푸나비나",
    "type": [
      "에스퍼",
      "페어리"
    ],
    "gen": 7,
    "stage": 1,
    "legend": true
  },
  {
    "id": 787,
    "name": "카푸브루루",
    "type": [
      "풀",
      "페어리"
    ],
    "gen": 7,
    "stage": 1,
    "legend": true
  },
  {
    "id": 788,
    "name": "카푸느지느",
    "type": [
      "물",
      "페어리"
    ],
    "gen": 7,
    "stage": 1,
    "legend": true
  },
  {
    "id": 789,
    "name": "코스모그",
    "type": [
      "에스퍼"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      790
    ],
    "legend": true
  },
  {
    "id": 790,
    "name": "코스모움",
    "type": [
      "에스퍼"
    ],
    "gen": 7,
    "stage": 2,
    "evolvesTo": [
      791,
      792
    ],
    "legend": true
  },
  {
    "id": 791,
    "name": "솔가레오",
    "type": [
      "에스퍼",
      "강철"
    ],
    "gen": 7,
    "stage": 3,
    "legend": true
  },
  {
    "id": 792,
    "name": "루나아라",
    "type": [
      "에스퍼",
      "고스트"
    ],
    "gen": 7,
    "stage": 3,
    "legend": true
  },
  {
    "id": 793,
    "name": "텅비드",
    "type": [
      "바위",
      "독"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 794,
    "name": "매시붕",
    "type": [
      "벌레",
      "격투"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 795,
    "name": "페로코체",
    "type": [
      "벌레",
      "격투"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 796,
    "name": "전수목",
    "type": [
      "전기"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 797,
    "name": "철화구야",
    "type": [
      "강철",
      "비행"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 798,
    "name": "종이신도",
    "type": [
      "풀",
      "강철"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 799,
    "name": "악식킹",
    "type": [
      "악",
      "드래곤"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 800,
    "name": "네크로즈마",
    "type": [
      "에스퍼"
    ],
    "gen": 7,
    "stage": 1,
    "legend": true
  },
  {
    "id": 801,
    "name": "마기아나",
    "type": [
      "강철",
      "페어리"
    ],
    "gen": 7,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 802,
    "name": "마샤도",
    "type": [
      "격투",
      "고스트"
    ],
    "gen": 7,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 803,
    "name": "베베놈",
    "type": [
      "독"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      804
    ]
  },
  {
    "id": 804,
    "name": "아고용",
    "type": [
      "독",
      "드래곤"
    ],
    "gen": 7,
    "stage": 2
  },
  {
    "id": 805,
    "name": "차곡차곡",
    "type": [
      "바위",
      "강철"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 806,
    "name": "두파팡",
    "type": [
      "불꽃",
      "고스트"
    ],
    "gen": 7,
    "stage": 1
  },
  {
    "id": 807,
    "name": "제라오라",
    "type": [
      "전기"
    ],
    "gen": 7,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 808,
    "name": "멜탄",
    "type": [
      "강철"
    ],
    "gen": 7,
    "stage": 1,
    "evolvesTo": [
      809
    ],
    "mythic": true
  },
  {
    "id": 809,
    "name": "멜메탈",
    "type": [
      "강철"
    ],
    "gen": 7,
    "stage": 2,
    "mythic": true
  },
  {
    "id": 810,
    "name": "흥나숭",
    "type": [
      "풀"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      811
    ]
  },
  {
    "id": 811,
    "name": "채키몽",
    "type": [
      "풀"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      812
    ]
  },
  {
    "id": 812,
    "name": "고릴타",
    "type": [
      "풀"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 813,
    "name": "염버니",
    "type": [
      "불꽃"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      814
    ]
  },
  {
    "id": 814,
    "name": "래비풋",
    "type": [
      "불꽃"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      815
    ]
  },
  {
    "id": 815,
    "name": "에이스번",
    "type": [
      "불꽃"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 816,
    "name": "울머기",
    "type": [
      "물"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      817
    ]
  },
  {
    "id": 817,
    "name": "누겔레온",
    "type": [
      "물"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      818
    ]
  },
  {
    "id": 818,
    "name": "인텔리레온",
    "type": [
      "물"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 819,
    "name": "탐리스",
    "type": [
      "노말"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      820
    ]
  },
  {
    "id": 820,
    "name": "요씽리스",
    "type": [
      "노말"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 821,
    "name": "파라꼬",
    "type": [
      "비행"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      822
    ]
  },
  {
    "id": 822,
    "name": "파크로우",
    "type": [
      "비행"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      823
    ]
  },
  {
    "id": 823,
    "name": "아머까오",
    "type": [
      "비행",
      "강철"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 824,
    "name": "두루지벌레",
    "type": [
      "벌레"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      825
    ]
  },
  {
    "id": 825,
    "name": "레돔벌레",
    "type": [
      "벌레",
      "에스퍼"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      826
    ]
  },
  {
    "id": 826,
    "name": "이올브",
    "type": [
      "벌레",
      "에스퍼"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 827,
    "name": "훔처우",
    "type": [
      "악"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      828
    ]
  },
  {
    "id": 828,
    "name": "폭슬라이",
    "type": [
      "악"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 829,
    "name": "꼬모카",
    "type": [
      "풀"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      830
    ]
  },
  {
    "id": 830,
    "name": "백솜모카",
    "type": [
      "풀"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 831,
    "name": "우르",
    "type": [
      "노말"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      832
    ]
  },
  {
    "id": 832,
    "name": "배우르",
    "type": [
      "노말"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 833,
    "name": "깨물부기",
    "type": [
      "물"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      834
    ]
  },
  {
    "id": 834,
    "name": "갈가부기",
    "type": [
      "물",
      "바위"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 835,
    "name": "멍파치",
    "type": [
      "전기"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      836
    ]
  },
  {
    "id": 836,
    "name": "펄스멍",
    "type": [
      "전기"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 837,
    "name": "탄동",
    "type": [
      "바위"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      838
    ]
  },
  {
    "id": 838,
    "name": "탄차곤",
    "type": [
      "바위",
      "불꽃"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      839
    ]
  },
  {
    "id": 839,
    "name": "석탄산",
    "type": [
      "바위",
      "불꽃"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 840,
    "name": "과사삭벌레",
    "type": [
      "풀",
      "드래곤"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      841,
      842,
      1011
    ]
  },
  {
    "id": 841,
    "name": "애프룡",
    "type": [
      "풀",
      "드래곤"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 842,
    "name": "단지래플",
    "type": [
      "풀",
      "드래곤"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 843,
    "name": "모래뱀",
    "type": [
      "땅"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      844
    ]
  },
  {
    "id": 844,
    "name": "사다이사",
    "type": [
      "땅"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 845,
    "name": "윽우지",
    "type": [
      "비행",
      "물"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 846,
    "name": "찌로꼬치",
    "type": [
      "물"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      847
    ]
  },
  {
    "id": 847,
    "name": "꼬치조",
    "type": [
      "물"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 848,
    "name": "일레즌",
    "type": [
      "전기",
      "독"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      849
    ]
  },
  {
    "id": 849,
    "name": "스트린더",
    "type": [
      "전기",
      "독"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 850,
    "name": "태우지네",
    "type": [
      "불꽃",
      "벌레"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      851
    ]
  },
  {
    "id": 851,
    "name": "다태우지네",
    "type": [
      "불꽃",
      "벌레"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 852,
    "name": "때때무노",
    "type": [
      "격투"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      853
    ]
  },
  {
    "id": 853,
    "name": "케오퍼스",
    "type": [
      "격투"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 854,
    "name": "데인차",
    "type": [
      "고스트"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      855
    ]
  },
  {
    "id": 855,
    "name": "포트데스",
    "type": [
      "고스트"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 856,
    "name": "몸지브림",
    "type": [
      "에스퍼"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      857
    ]
  },
  {
    "id": 857,
    "name": "손지브림",
    "type": [
      "에스퍼"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      858
    ]
  },
  {
    "id": 858,
    "name": "브리무음",
    "type": [
      "에스퍼",
      "페어리"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 859,
    "name": "메롱꿍",
    "type": [
      "악",
      "페어리"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      860
    ]
  },
  {
    "id": 860,
    "name": "쏘겨모",
    "type": [
      "악",
      "페어리"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      861
    ]
  },
  {
    "id": 861,
    "name": "오롱털",
    "type": [
      "악",
      "페어리"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 862,
    "name": "가로막구리",
    "type": [
      "악",
      "노말"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 863,
    "name": "나이킹",
    "type": [
      "강철"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 864,
    "name": "산호르곤",
    "type": [
      "고스트"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 865,
    "name": "창파나이트",
    "type": [
      "격투"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 866,
    "name": "마임꽁꽁",
    "type": [
      "얼음",
      "에스퍼"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 867,
    "name": "데스판",
    "type": [
      "땅",
      "고스트"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 868,
    "name": "마빌크",
    "type": [
      "페어리"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      869
    ]
  },
  {
    "id": 869,
    "name": "마휘핑",
    "type": [
      "페어리"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 870,
    "name": "대여르",
    "type": [
      "격투"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 871,
    "name": "찌르성게",
    "type": [
      "전기"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 872,
    "name": "누니머기",
    "type": [
      "얼음",
      "벌레"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      873
    ]
  },
  {
    "id": 873,
    "name": "모스노우",
    "type": [
      "얼음",
      "벌레"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 874,
    "name": "돌헨진",
    "type": [
      "바위"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 875,
    "name": "빙큐보",
    "type": [
      "얼음"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 876,
    "name": "에써르",
    "type": [
      "에스퍼",
      "노말"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 877,
    "name": "모르페코",
    "type": [
      "전기",
      "악"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 878,
    "name": "끼리동",
    "type": [
      "강철"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      879
    ]
  },
  {
    "id": 879,
    "name": "대왕끼리동",
    "type": [
      "강철"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 880,
    "name": "파치래곤",
    "type": [
      "전기",
      "드래곤"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 881,
    "name": "파치르돈",
    "type": [
      "전기",
      "얼음"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 882,
    "name": "어래곤",
    "type": [
      "물",
      "드래곤"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 883,
    "name": "어치르돈",
    "type": [
      "물",
      "얼음"
    ],
    "gen": 8,
    "stage": 1
  },
  {
    "id": 884,
    "name": "두랄루돈",
    "type": [
      "강철",
      "드래곤"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      1018
    ]
  },
  {
    "id": 885,
    "name": "드라꼰",
    "type": [
      "드래곤",
      "고스트"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      886
    ]
  },
  {
    "id": 886,
    "name": "드래런치",
    "type": [
      "드래곤",
      "고스트"
    ],
    "gen": 8,
    "stage": 2,
    "evolvesTo": [
      887
    ]
  },
  {
    "id": 887,
    "name": "드래펄트",
    "type": [
      "드래곤",
      "고스트"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 888,
    "name": "자시안",
    "type": [
      "페어리"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 889,
    "name": "자마젠타",
    "type": [
      "격투"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 890,
    "name": "무한다이노",
    "type": [
      "독",
      "드래곤"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 891,
    "name": "치고마",
    "type": [
      "격투"
    ],
    "gen": 8,
    "stage": 1,
    "evolvesTo": [
      892
    ],
    "legend": true
  },
  {
    "id": 892,
    "name": "우라오스",
    "type": [
      "격투",
      "악"
    ],
    "gen": 8,
    "stage": 2,
    "legend": true
  },
  {
    "id": 893,
    "name": "자루도",
    "type": [
      "악",
      "풀"
    ],
    "gen": 8,
    "stage": 1,
    "mythic": true
  },
  {
    "id": 894,
    "name": "레지에레키",
    "type": [
      "전기"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 895,
    "name": "레지드래고",
    "type": [
      "드래곤"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 896,
    "name": "블리자포스",
    "type": [
      "얼음"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 897,
    "name": "레이스포스",
    "type": [
      "고스트"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 898,
    "name": "버드렉스",
    "type": [
      "에스퍼",
      "풀"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 899,
    "name": "신비록",
    "type": [
      "노말",
      "에스퍼"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 900,
    "name": "사마자르",
    "type": [
      "벌레",
      "바위"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 901,
    "name": "다투곰",
    "type": [
      "땅",
      "노말"
    ],
    "gen": 8,
    "stage": 3
  },
  {
    "id": 902,
    "name": "대쓰여너",
    "type": [
      "물",
      "고스트"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 903,
    "name": "포푸니크",
    "type": [
      "격투",
      "독"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 904,
    "name": "장침바루",
    "type": [
      "악",
      "독"
    ],
    "gen": 8,
    "stage": 2
  },
  {
    "id": 905,
    "name": "러브로스",
    "type": [
      "페어리",
      "비행"
    ],
    "gen": 8,
    "stage": 1,
    "legend": true
  },
  {
    "id": 906,
    "name": "나오하",
    "type": [
      "풀"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      907
    ]
  },
  {
    "id": 907,
    "name": "나로테",
    "type": [
      "풀"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      908
    ]
  },
  {
    "id": 908,
    "name": "마스카나",
    "type": [
      "풀",
      "악"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 909,
    "name": "뜨아거",
    "type": [
      "불꽃"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      910
    ]
  },
  {
    "id": 910,
    "name": "악뜨거",
    "type": [
      "불꽃"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      911
    ]
  },
  {
    "id": 911,
    "name": "라우드본",
    "type": [
      "불꽃",
      "고스트"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 912,
    "name": "꾸왁스",
    "type": [
      "물"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      913
    ]
  },
  {
    "id": 913,
    "name": "아꾸왁",
    "type": [
      "물"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      914
    ]
  },
  {
    "id": 914,
    "name": "웨이니발",
    "type": [
      "물",
      "격투"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 915,
    "name": "맛보돈",
    "type": [
      "노말"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      916
    ]
  },
  {
    "id": 916,
    "name": "퍼퓨돈",
    "type": [
      "노말"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 917,
    "name": "타랜툴라",
    "type": [
      "벌레"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      918
    ]
  },
  {
    "id": 918,
    "name": "트래피더",
    "type": [
      "벌레"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 919,
    "name": "콩알뚜기",
    "type": [
      "벌레"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      920
    ]
  },
  {
    "id": 920,
    "name": "엑스레그",
    "type": [
      "벌레",
      "악"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 921,
    "name": "빠모",
    "type": [
      "전기"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      922
    ]
  },
  {
    "id": 922,
    "name": "빠모트",
    "type": [
      "전기",
      "격투"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      923
    ]
  },
  {
    "id": 923,
    "name": "빠르모트",
    "type": [
      "전기",
      "격투"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 924,
    "name": "두리쥐",
    "type": [
      "노말"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      925
    ]
  },
  {
    "id": 925,
    "name": "파밀리쥐",
    "type": [
      "노말"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 926,
    "name": "쫀도기",
    "type": [
      "페어리"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      927
    ]
  },
  {
    "id": 927,
    "name": "바우첼",
    "type": [
      "페어리"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 928,
    "name": "미니브",
    "type": [
      "풀",
      "노말"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      929
    ]
  },
  {
    "id": 929,
    "name": "올리뇨",
    "type": [
      "풀",
      "노말"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      930
    ]
  },
  {
    "id": 930,
    "name": "올리르바",
    "type": [
      "풀",
      "노말"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 931,
    "name": "시비꼬",
    "type": [
      "노말",
      "비행"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 932,
    "name": "베베솔트",
    "type": [
      "바위"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      933
    ]
  },
  {
    "id": 933,
    "name": "스태솔트",
    "type": [
      "바위"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      934
    ]
  },
  {
    "id": 934,
    "name": "콜로솔트",
    "type": [
      "바위"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 935,
    "name": "카르본",
    "type": [
      "불꽃"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      936,
      937
    ]
  },
  {
    "id": 936,
    "name": "카디나르마",
    "type": [
      "불꽃",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 937,
    "name": "파라블레이즈",
    "type": [
      "불꽃",
      "고스트"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 938,
    "name": "빈나두",
    "type": [
      "전기"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      939
    ]
  },
  {
    "id": 939,
    "name": "찌리배리",
    "type": [
      "전기"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 940,
    "name": "찌리비",
    "type": [
      "전기",
      "비행"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      941
    ]
  },
  {
    "id": 941,
    "name": "찌리비크",
    "type": [
      "전기",
      "비행"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 942,
    "name": "오라티프",
    "type": [
      "악"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      943
    ]
  },
  {
    "id": 943,
    "name": "마피티프",
    "type": [
      "악"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 944,
    "name": "땃쭈르",
    "type": [
      "독",
      "노말"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      945
    ]
  },
  {
    "id": 945,
    "name": "태깅구르",
    "type": [
      "독",
      "노말"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 946,
    "name": "그푸리",
    "type": [
      "풀",
      "고스트"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      947
    ]
  },
  {
    "id": 947,
    "name": "공푸리",
    "type": [
      "풀",
      "고스트"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 948,
    "name": "들눈해",
    "type": [
      "땅",
      "풀"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      949
    ]
  },
  {
    "id": 949,
    "name": "육파리",
    "type": [
      "땅",
      "풀"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 950,
    "name": "절벼게",
    "type": [
      "바위"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 951,
    "name": "캡싸이",
    "type": [
      "풀"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      952
    ]
  },
  {
    "id": 952,
    "name": "스코빌런",
    "type": [
      "풀",
      "불꽃"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 953,
    "name": "구르데",
    "type": [
      "벌레"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      954
    ]
  },
  {
    "id": 954,
    "name": "베라카스",
    "type": [
      "벌레",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 955,
    "name": "하느라기",
    "type": [
      "에스퍼"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      956
    ]
  },
  {
    "id": 956,
    "name": "클레스퍼트라",
    "type": [
      "에스퍼"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 957,
    "name": "어리짱",
    "type": [
      "페어리",
      "강철"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      958
    ]
  },
  {
    "id": 958,
    "name": "벼리짱",
    "type": [
      "페어리",
      "강철"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      959
    ]
  },
  {
    "id": 959,
    "name": "두드리짱",
    "type": [
      "페어리",
      "강철"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 960,
    "name": "바다그다",
    "type": [
      "물"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      961
    ]
  },
  {
    "id": 961,
    "name": "바닥트리오",
    "type": [
      "물"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 962,
    "name": "떨구새",
    "type": [
      "비행",
      "악"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 963,
    "name": "맨돌핀",
    "type": [
      "물"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      964
    ]
  },
  {
    "id": 964,
    "name": "돌핀맨",
    "type": [
      "물"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 965,
    "name": "부르롱",
    "type": [
      "강철",
      "독"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      966
    ]
  },
  {
    "id": 966,
    "name": "부르르룸",
    "type": [
      "강철",
      "독"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 967,
    "name": "모토마",
    "type": [
      "드래곤",
      "노말"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 968,
    "name": "꿈트렁",
    "type": [
      "강철"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 969,
    "name": "초롱순",
    "type": [
      "바위",
      "독"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      970
    ]
  },
  {
    "id": 970,
    "name": "킬라플로르",
    "type": [
      "바위",
      "독"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 971,
    "name": "망망이",
    "type": [
      "고스트"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      972
    ]
  },
  {
    "id": 972,
    "name": "묘두기",
    "type": [
      "고스트"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 973,
    "name": "꼬이밍고",
    "type": [
      "비행",
      "격투"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 974,
    "name": "터벅고래",
    "type": [
      "얼음"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      975
    ]
  },
  {
    "id": 975,
    "name": "우락고래",
    "type": [
      "얼음"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 976,
    "name": "가비루사",
    "type": [
      "물",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 977,
    "name": "어써러셔",
    "type": [
      "물"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 978,
    "name": "싸리용",
    "type": [
      "드래곤",
      "물"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 979,
    "name": "저승갓숭",
    "type": [
      "격투",
      "고스트"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 980,
    "name": "토오",
    "type": [
      "독",
      "땅"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 981,
    "name": "키키링",
    "type": [
      "노말",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 982,
    "name": "노고고치",
    "type": [
      "노말"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 983,
    "name": "대도각참",
    "type": [
      "악",
      "강철"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 984,
    "name": "위대한엄니",
    "type": [
      "땅",
      "격투"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 985,
    "name": "우렁찬꼬리",
    "type": [
      "페어리",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 986,
    "name": "사나운버섯",
    "type": [
      "풀",
      "악"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 987,
    "name": "날개치는머리",
    "type": [
      "고스트",
      "페어리"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 988,
    "name": "땅을기는날개",
    "type": [
      "벌레",
      "격투"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 989,
    "name": "모래털가죽",
    "type": [
      "전기",
      "땅"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 990,
    "name": "무쇠바퀴",
    "type": [
      "땅",
      "강철"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 991,
    "name": "무쇠보따리",
    "type": [
      "얼음",
      "물"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 992,
    "name": "무쇠손",
    "type": [
      "격투",
      "전기"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 993,
    "name": "무쇠머리",
    "type": [
      "악",
      "비행"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 994,
    "name": "무쇠독나방",
    "type": [
      "불꽃",
      "독"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 995,
    "name": "무쇠가시",
    "type": [
      "바위",
      "전기"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 996,
    "name": "드니차",
    "type": [
      "드래곤",
      "얼음"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      997
    ]
  },
  {
    "id": 997,
    "name": "드니꽁",
    "type": [
      "드래곤",
      "얼음"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      998
    ]
  },
  {
    "id": 998,
    "name": "드닐레이브",
    "type": [
      "드래곤",
      "얼음"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 999,
    "name": "모으령",
    "type": [
      "고스트"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      1000
    ]
  },
  {
    "id": 1000,
    "name": "타부자고",
    "type": [
      "강철",
      "고스트"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 1001,
    "name": "총지엔",
    "type": [
      "악",
      "풀"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1002,
    "name": "파오젠",
    "type": [
      "악",
      "얼음"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1003,
    "name": "딩루",
    "type": [
      "악",
      "땅"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1004,
    "name": "위유이",
    "type": [
      "악",
      "불꽃"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1005,
    "name": "고동치는달",
    "type": [
      "드래곤",
      "악"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1006,
    "name": "무쇠무인",
    "type": [
      "페어리",
      "격투"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1007,
    "name": "코라이돈",
    "type": [
      "격투",
      "드래곤"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1008,
    "name": "미라이돈",
    "type": [
      "전기",
      "드래곤"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1009,
    "name": "굽이치는물결",
    "type": [
      "물",
      "드래곤"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1010,
    "name": "무쇠잎새",
    "type": [
      "풀",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1011,
    "name": "과미르",
    "type": [
      "풀",
      "드래곤"
    ],
    "gen": 9,
    "stage": 2,
    "evolvesTo": [
      1019
    ]
  },
  {
    "id": 1012,
    "name": "차데스",
    "type": [
      "풀",
      "고스트"
    ],
    "gen": 9,
    "stage": 1,
    "evolvesTo": [
      1013
    ]
  },
  {
    "id": 1013,
    "name": "그우린차",
    "type": [
      "풀",
      "고스트"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 1014,
    "name": "조타구",
    "type": [
      "독",
      "격투"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1015,
    "name": "이야후",
    "type": [
      "독",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1016,
    "name": "기로치",
    "type": [
      "독",
      "페어리"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1017,
    "name": "오거폰",
    "type": [
      "풀"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1018,
    "name": "브리두라스",
    "type": [
      "강철",
      "드래곤"
    ],
    "gen": 9,
    "stage": 2
  },
  {
    "id": 1019,
    "name": "과미드라",
    "type": [
      "풀",
      "드래곤"
    ],
    "gen": 9,
    "stage": 3
  },
  {
    "id": 1020,
    "name": "꿰뚫는화염",
    "type": [
      "불꽃",
      "드래곤"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1021,
    "name": "날뛰는우레",
    "type": [
      "전기",
      "드래곤"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1022,
    "name": "무쇠암석",
    "type": [
      "바위",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1023,
    "name": "무쇠감투",
    "type": [
      "강철",
      "에스퍼"
    ],
    "gen": 9,
    "stage": 1
  },
  {
    "id": 1024,
    "name": "테라파고스",
    "type": [
      "노말"
    ],
    "gen": 9,
    "stage": 1,
    "legend": true
  },
  {
    "id": 1025,
    "name": "복숭악동",
    "type": [
      "독",
      "고스트"
    ],
    "gen": 9,
    "stage": 1,
    "mythic": true
  }
];

const TYPE_COLORS = {
  "노말": "#9fa19f",
  "불꽃": "#e62829",
  "물": "#2980ef",
  "풀": "#3fa129",
  "전기": "#fac000",
  "얼음": "#3dcef3",
  "격투": "#ff8000",
  "독": "#9141cb",
  "땅": "#915121",
  "비행": "#81b9ef",
  "에스퍼": "#ef4179",
  "벌레": "#91a119",
  "바위": "#afa981",
  "고스트": "#704170",
  "드래곤": "#5060e1",
  "강철": "#60a1b8",
  "악": "#50413f",
  "페어리": "#ef70ef"
};

// 세대별 메타데이터 (1~9세대 전체)
const GENERATION_INFO = {
  1: { id: 1, name: "1세대", range: [1, 151], defaultTarget: 151, legendCandidates: [144, 145, 146, 149, 150, 151] },
  2: { id: 2, name: "2세대", range: [152, 251], defaultTarget: 250, legendCandidates: [243, 244, 245, 248, 249, 250, 251] },
  3: { id: 3, name: "3세대", range: [252, 386], defaultTarget: 384, legendCandidates: [377, 378, 379, 380, 381, 382, 383, 384, 385, 386] },
  4: { id: 4, name: "4세대", range: [387, 493], defaultTarget: 493, legendCandidates: [480, 481, 482, 483, 484, 485, 486, 487, 491, 493] },
  5: { id: 5, name: "5세대", range: [494, 649], defaultTarget: 644, legendCandidates: [638, 639, 640, 641, 642, 643, 644, 645, 646] },
  6: { id: 6, name: "6세대", range: [650, 721], defaultTarget: 716, legendCandidates: [716, 717, 718, 719, 720, 721] },
  7: { id: 7, name: "7세대", range: [722, 809], defaultTarget: 791, legendCandidates: [785, 786, 787, 788, 791, 792, 800, 807] },
  8: { id: 8, name: "8세대", range: [810, 905], defaultTarget: 888, legendCandidates: [888, 889, 890, 891, 892, 898, 905] },
  9: { id: 9, name: "9세대", range: [906, 1025], defaultTarget: 1008, legendCandidates: [1001, 1002, 1003, 1004, 1007, 1008, 1024, 1025] }
};

function getPokemonOfficialArtUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getPokemonPixelSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function getPokemonAnimatedGifUrl(id) {
  if (id <= 649) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  }
  return getPokemonPixelSpriteUrl(id);
}

function getSafeImgAttrs(id, name, cssClass = '') {
  const artUrl = getPokemonOfficialArtUrl(id);
  const pixelUrl = getPokemonPixelSpriteUrl(id);
  const gifUrl = getPokemonAnimatedGifUrl(id);
  return `class="${cssClass}" src="${artUrl}" alt="${name}" onerror="if(!this.dataset.fallback1){this.dataset.fallback1='1';this.src='${pixelUrl}';}else if(!this.dataset.fallback2){this.dataset.fallback2='1';this.src='${gifUrl}';}"`;
}

function formatPokemonId(id) {
  return `#${String(id).padStart(3, '0')}`;
}

function findPokemonById(id) {
  return POKEMON_DATABASE.find(p => p.id === Number(id)) || null;
}
