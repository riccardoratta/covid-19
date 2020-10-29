import click
import requests
import csv
import json
from datetime import datetime

file = 'data.csv'
url_head = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni'
url_tail = '.csv'
api_url = 'http://localhost:80'
header_start = 6
header_end = 19
header = ("date,state,region_id,region_name,lat,lon,hospitalized_with_symptoms,intensive_care,total_hospitalized,"
          "home_isolation,total_positive,total_positive_variation,new_positives,resigned_cured,deceased,"
          "cases_from_suspected_diagnostic,cases_from_screening,total_cases,tampons,cases_tested,notes\n")


@click.group(chain=True)
def main():
    """
    Simple CLI for downloading and posting data
    """
    pass


@main.command()
@click.option('-a', '--all', is_flag=True)
@click.option('-l', '--lastest', is_flag=True)
@click.option('-d', '--date')
def download(all, lastest, date):
    "Download by date, all, or last"

    if (all and lastest) or (all and date) or (lastest and date):
        click.echo("Multiple options not allowed")
        return
    elif all:
        click.echo("Downloading all days data...")
        query = ''
    elif lastest:
        click.echo("Downloading lastest day data...")
        query = '-latest'
    elif date:
        click.echo("Download data corrisponding to day " + date +
                   " in yyyymmdd format (Ex. 20200304 download for 04 March 2020)...")
        query = '-' + date
    else:
        click.echo(click.get_current_context().get_help())
        return

    url = url_head + query + url_tail
    click.echo("Fetching: " + url)
    response = requests.get(url)
    file_content = response.content
    file_content = header.encode('UTF-8') + file_content.split(b'\n', 1)[1]
    open(file, 'wb').write(file_content)


@main.command()
@click.option('-c', '--create', is_flag=True)
@click.option('-u', '--update', is_flag=True)
def send(create, update):
    "Send data to db create or update (post or patch)"

    with open(file) as csvfile:
        reader = csv.DictReader(csvfile)
        field = reader.fieldnames
        status_codes = dict()

        for row in reader:
            payload = {field[i]: int(row[field[i]])
                       for i in range(header_start, header_end)}
            date = datetime.fromisoformat(row['date'])
            url = api_url + '/region/' + \
                row['region_id'] + "/cases/" + str(date.year) + \
                "/" + str(date.month) + "/" + str(date.day)

            if create and update:
                click.echo("Multiple options not allowed")
                return
            elif create:
                response = requests.post(url, data=json.dumps(payload), headers={
                                         "content-type": "application/json"})
            elif update:
                response = requests.patch(url, data=json.dumps(payload), headers={
                                          "content-type": "application/json"})
            else:
                click.echo(click.get_current_context().get_help())
                return

            key = 'n of ' + str(response.status_code)
            status_codes[key] = status_codes[key] + \
                1 if key in status_codes else 1

        click.echo("Status codes results: ")
        click.echo(status_codes)


if __name__ == "__main__":
    main()
