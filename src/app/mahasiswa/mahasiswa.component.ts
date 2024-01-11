import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, OnInit, Renderer2 } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.component.html',
  styleUrl: './mahasiswa.component.css',
})
export class MahasiswaComponent implements OnInit, AfterViewInit {
  data: any;
  table1: any;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-closed');

    this.table1 = $('#table1').DataTable();
    this.bind_mahasiswa();
  }
  ngOnInit(): void {}

  bind_mahasiswa(): void {
    this.http
      .get('https://stmikpontianak.net/011100862/tampilMahasiswa.php')
      .subscribe((data: any) => {
        console.log(data);

        this.table1.clear();

        let counter = 1;

        data.forEach((element: any) => {
          let tempatTanggalLahir =
            element.TempatLahir + ', ' + element.TanggalLahir;

          let row = [
            counter,
            element.NIM,
            element.Nama,
            element.JenisKelamin,
            tempatTanggalLahir,
            element.JP,
            element.Alamat,
            element.StatusNikah,
            element.TahunMasuk,
          ];
          counter++;
          this.table1.row.add(row);
        });
        this.table1.draw(false);
      });
  }

  showTambahModal(): void {
    $('#tambahModal').modal();
  }

  postRecord(): void {
    let nim = $('#nimText').val();
    let nama = $('#namaText').val();
    let jenisKelamin = $('#jenisKelaminSelect').val();
    let tempatLahir = $('#tempatLahirText').val();
    let tanggalLahir = $('#tanggalLahirText').val();
    let prodi = $('#prodiSelect').val();
    let alamat = $('#alamatText').val();
    let status = $('#statusSelect').val();
    let tahunMasuk = $('#tahunMasukText').val();

    if (nim.length == 0) {
      alert('Nim belum diisi');
      return;
    }
    if (nama.length == 0) {
      alert('nama belum diisi');
      return;
    }
    if (jenisKelamin.length == 0) {
      alert('Jenis Kelamin belum diisi');
      return;
    }
    if (tempatLahir.length == 0) {
      alert('Tempat Lahir belum diisi');
      return;
    }
    if (tanggalLahir.length == 0) {
      alert('Tanggal Lahir belum diisi');
      return;
    }
    if (prodi.length == 0) {
      alert('Prodi belum diisi');
      return;
    }
    if (alamat.length == 0) {
      alert('Alamat belum diisi');
      return;
    }
    if (status.length == 0) {
      alert('Status Lahir belum diisi');
      return;
    }
    if (tahunMasuk.length == 0) {
      alert('Tahun Masuk Lahir belum diisi');
      return;
    }

    nim = encodeURIComponent(nim);
    nama = encodeURIComponent(nama);
    jenisKelamin = encodeURIComponent(jenisKelamin);
    tempatLahir = encodeURIComponent(tempatLahir);
    tanggalLahir = encodeURIComponent(tanggalLahir);
    prodi = encodeURIComponent(prodi);
    alamat = encodeURIComponent(alamat);
    status = encodeURIComponent(status);
    tahunMasuk = encodeURIComponent(tahunMasuk);

    let url =
      'https://stmikpontianak.net/011100862/tambahMahasiswa.php' +
      '?nim=' +
      nim +
      '&nama=' +
      nama +
      '&jenisKelamin=' +
      jenisKelamin +
      '&tempatLahir=' +
      tempatLahir +
      '&tanggalLahir=' +
      tanggalLahir +
      '&jp=' +
      prodi +
      '&alamat=' +
      alamat +
      '&statusPernikahan=' +
      status +
      '&tahunMasuk=' +
      tahunMasuk;

    this.http.get(url).subscribe((data: any) => {
      console.log(data);
      alert(data.status + ' -->' + data.message);

      this.bind_mahasiswa();
      $('#tambahModal').modal('hide');
    });
  }
}