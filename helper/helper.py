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


def my_int(v):
    # convert string to int (if possible) or to None (if not)
    try:
        variable = int(v)
    except ValueError:
        variable = None
    return variable


@click.group(chain=True)
# make a group with chaining for commands
def main():
    """
    Simple CLI for downloading and sending data
    """
    pass


@main.command()
@click.option('-a', '--all', is_flag=True)
@click.option('-l', '--latest', is_flag=True)
@click.option('-d', '--date')
def download(all, latest, date):
    # download command
    "Download data (by date, all, or latest)"

    if (all and latest) or (all and date) or (latest and date):
        click.echo("Multiple options not allowed")
        return
    elif all:
        click.echo("Downloading all days data...")
        query = ''
    elif latest:
        click.echo("Downloading latest day data...")
        query = '-latest'
    elif date:
        click.echo("Download data corrisponding to day " + date +
                   " in yyyymmdd format (Ex. 20200304 download for 04 March 2020)...")
        query = '-' + date
    else:
        click.echo(click.get_current_context().get_help())
        return

    url = url_head + query + url_tail  # compose final url
    click.echo("Fetching: " + url)
    response = requests.get(url)  # http get request to repository file
    file_content = response.content
    file_content = header.encode(
        'UTF-8') + file_content.split(b'\n', 1)[1]  # replace original header
    open(file, 'wb').write(file_content)  # write content to csv file


@main.command()
def send():
    # send command
    "Send data to db (put)"

    with open(file) as csvfile:  # open csv file
        reader = csv.DictReader(csvfile)
        field = reader.fieldnames  # get header
        status_codes = dict()
        click.echo("Sending data...")

        for row in reader:  # for each row
            payload = {field[i]: my_int(row[field[i]])
                       for i in range(header_start, header_end)}  # create payload object
            date = datetime.fromisoformat(row['date'])
            url = api_url + '/region/' + \
                row['region_id'] + "/cases/" + str(date.year) + \
                "/" + str(date.month) + "/" + \
                str(date.day)  # compose final url
            response = requests.put(url, data=json.dumps(payload), headers={
                "content-type": "application/json"})  # http put request to api
            key = 'n of ' + str(response.status_code)
            status_codes[key] = status_codes[key] + \
                1 if key in status_codes else 1  # add response status code to dictionary

        click.echo("Status codes results: ")
        click.echo(status_codes)


if __name__ == "__main__":
    main()
