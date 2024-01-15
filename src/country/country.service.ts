import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import {
  UpdateCityInput,
  UpdateCountryInput,
  UpdateStateInput,
} from './dto/update-country.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}
  createFromJson(data: CreateCountryInput[]) {
    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        data.map(async (data) => {
          const country = await tx.country.create({
            data: {
              countryName: data.countryName,
              countryCode: data.countryCode,
            },
          });
          if (data.state) {
            await Promise.all(
              data.state.map(async (sta) => {
                const stateData = {
                  countryId: country.id,
                  stateCode: sta.stateCode,
                  stateName: sta.stateName,
                };
                const state = await tx.state.create({ data: stateData });
                if (sta.city) {
                  const city = sta.city.map((cit) => {
                    return {
                      stateId: state.id,
                      cityName: cit.cityName,
                    };
                  });
                  await tx.city.createMany({ data: city });
                }
              }),
            );
          }
          return country;
        }),
      );
    });
  }

  create(data: CreateCountryInput): Promise<Country> {
    return this.prisma.$transaction(async (tx) => {
      const country = await tx.country.create({
        data: { countryName: data.countryName, countryCode: data.countryCode },
      });
      if (data.state) {
        await Promise.all(
          data.state.map(async (sta) => {
            const stateData = {
              countryId: country.id,
              stateCode: sta.stateCode,
              stateName: sta.stateName,
            };
            const state = await tx.state.create({ data: stateData });
            if (sta.city) {
              const city = sta.city.map((cit) => {
                return {
                  stateId: state.id,
                  cityName: cit.cityName,
                };
              });
              await tx.city.createMany({ data: city });
            }
          }),
        );
      }
      return country;
    });
  }

  findAll(): Promise<Country[]> {
    return this.prisma.country.findMany();
  }

  getStatesByCountryId(countryId: number) {
    return this.prisma.state.findMany({
      where: { countryId },
      include: { city: true },
    });
  }
  getCitiesByStateId(stateId: number) {
    return this.prisma.city.findMany({ where: { stateId } });
  }

  findOne(id: number): Promise<Country> {
    return this.prisma.country.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCountryInput): Promise<Country> {
    return this.prisma.country.update({ where: { id }, data });
  }

  updateState(id: number, data: UpdateStateInput) {
    return this.prisma.state.update({ where: { id }, data });
  }

  updateCity(id: number, data: UpdateCityInput) {
    return this.prisma.city.update({ where: { id }, data });
  }

  async removeState(id: number): Promise<boolean> {
    const state = await this.prisma.state.findUnique({ where: { id } });
    if (!state) return false;
    await this.prisma.city.deleteMany({ where: { stateId: id } });
    await this.prisma.state.delete({ where: { id } });
    return true;
  }

  async removeCity(id: number): Promise<boolean> {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) return false;
    await this.prisma.city.delete({ where: { id } });
    return true;
  }

  async remove(id: number): Promise<boolean> {
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: { state: { include: { city: true } } },
    });

    if (!country) return false;

    for (const state of country.state)
      await this.prisma.city.deleteMany({ where: { stateId: state.id } });

    await this.prisma.state.deleteMany({ where: { countryId: id } });

    await this.prisma.country.delete({ where: { id } });

    return true;
  }
}
