export interface UserScheduleProfile {
  date: string;
  info: string | null;
  h9to10: number | null;
  h10to11: number | null;
  h11to12: number | null;
  h2to3: number | null;
  h3to4: number | null;
  h4to5: number | null;
  h5to6: number | null;
  h6to7: number | null;
  h7to8: number | null;
  h8to9: number | null;
  h9to10pm: number | null;
  h10to11pm: number | null;
  h11to12pm: number | null;
}

export interface UserScheduleTVP {
  id: number | null;
  schedulerId: number;
  participantId: number | null; // -1 or userId or null
  date: string; // yyyy-mm-dd
  startTime: string; // HH:mm:ss
  loginId: number;
}
