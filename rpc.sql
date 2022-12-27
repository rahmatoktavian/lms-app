CREATE OR REPLACE FUNCTION kelas_materi_file_rpc(peserta_id_filter uuid)
 RETURNS TABLE(id uuid, tipe varchar, url varchar, label varchar, log_time timestamptz)
 LANGUAGE sql
AS $function$
select kelas_materi_file.id ,kelas_materi_file.tipe ,kelas_materi_file.materi_url, kelas_materi_file.label,
  (select kelas_materi_file_log.waktu_akses from kelas_materi_file_log where peserta_id = peserta_id_filter and kelas_materi_file_id = kelas_materi_file.id) as log_time
from kelas_materi_file
order by kelas_materi_file.urutan;
$function$;