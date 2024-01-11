import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const $: any;
declare const moment: any;

@Component({
  selector: 'app-cuaca',
  templateUrl: './cuaca.component.html',
  styleUrl: './cuaca.component.css',
})
export class CuacaComponent implements OnInit, AfterViewInit {
  private table1: any;

  public waktuSunset: any;
  public waktuSunrise: any;

  constructor(private renderer: Renderer2, private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-close');

    this.table1 = $('#table1').DataTable({
      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4],
          className: 'text-center',
        },
        {
          targets: 1,
          render: function (data: string) {
            let waktu = moment(data + ' UTC');

            let html =
              waktu.local().format('YYYY-MM-DD') +
              '<br />' +
              waktu.local().format('HH:mm') +
              ' WIB';
            return html;
          },
        },
        {
          targets: 2,
          render: function (data: string) {
            let html = "<img src='" + data + "' />";
            return html;
          },
        },
        {
          targets: 3,
          render: function (data: string) {
            let array = data.split('||');
            let cuaca = array[0];
            let deskripsi = array[1];
            let html = '<strong>' + cuaca + '</strong><br />' + deskripsi;
            return html;
          },
        },
      ],
    });

    this.bind_table1();
  }

  bind_table1(): void {
    let url =
      'https://api.openweathermap.org/data/2.5/forecast?id=1630789&appid=a102c064f03c4cf828e3dbd554530802';
    this.http.get(url).subscribe((data: any) => {
      let list = data.list;

      let sunrise = data.city.sunrise;

      let tanggal = sunrise / 86400;
      let sisa_detik = sunrise / 86400;
      let jam = Math.floor(sisa_detik / 3600);
      sisa_detik = sisa_detik % 3600;
      let menit = Math.floor(sisa_detik / 60);
      let detik = Math.floor(sisa_detik % 60);
      this.waktuSunrise = jam + ':' + menit + ':' + detik;

      let sunset = data.city.sunset;
      sisa_detik = Math.floor(sunset / 86400);
      jam = Math.floor(sisa_detik / 3600) + 12;
      sisa_detik = Math.floor(sisa_detik % 3600);
      menit = Math.floor(sisa_detik / 60);
      detik = Math.floor(sisa_detik % 60);
      this.waktuSunset = jam + ':' + menit + ':' + detik;

      this.table1.clear();
      let counter = 1;
      list.forEach((element: any) => {
        let weather = element.weather[0];

        let iconUrl =
          'https://openweathermap.org/img/wn/' + weather.icon + '@2x.png';
        let cuacaDeskripsi = weather.main + '||' + weather.description;

        let main = element.main;

        let tempMin = this.kelvinToCelcius(main.temp_min);
        let temptMax = this.kelvinToCelcius(main.temp_max);

        let temp = tempMin + '°C - ' + temptMax + '°C';

        let row = [counter, element.dt_txt, iconUrl, cuacaDeskripsi, temp];

        this.table1.row.add(row);

        counter++;
      });
      this.table1.draw(false);
    });
  }

  kelvinToCelcius(kelvin: any): any {
    let celcius = kelvin - 237.15;
    celcius = Math.round(celcius * 100) / 100;
    return celcius;
  }
  ngOnInit(): void { }
}